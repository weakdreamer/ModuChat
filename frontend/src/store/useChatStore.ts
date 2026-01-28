import { create } from 'zustand';
import { ChatMessage, WebSocketChatMessage, WebSocketMessage, OnlineUser, OnlineUsersMessage } from '../types';
import { websocketApi, chatApi } from '../api';

interface ChatState {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
  isLoadingMessages: boolean;
  socket: WebSocket | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  sendMessage: (content: string) => void;
  connectWebSocket: (token: string) => void;
  disconnectWebSocket: () => void;
  addMessage: (message: ChatMessage) => void;
  fetchMessages: () => Promise<void>;
  updateOnlineUsers: (users: OnlineUser[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  onlineUsers: [],
  isLoadingMessages: false,
  socket: null,
  connectionStatus: 'disconnected',

  // 发送消息
  sendMessage: (content) => {
    console.log('Sending message:', content);
    const socket = get().socket;
    console.log('WebSocket status:', socket?.readyState);
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    // 获取真实用户信息
    const userIdStr = localStorage.getItem('user_id');
    const username = localStorage.getItem('user_username');
    console.log('Current user from localStorage:', userIdStr, username);
    
    // 验证用户信息是否存在
    if (!userIdStr || !username) {
      console.error('User information not found in localStorage');
      return;
    }
    
    const userId = Number(userIdStr);

    // 创建临时消息（客户端ID，用于优化用户体验）
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      content,
      sender_id: userId,  // 使用真实用户ID
      sender_name: username,  // 使用真实用户名
      timestamp: new Date().toISOString(),
      message_type: 'text',  // 添加消息类型
    };

    console.log('Adding temp message:', tempMessage);
    // 立即添加到本地消息列表，优化用户体验
    get().addMessage(tempMessage);

    const message: WebSocketChatMessage = {
      type: 'chat.text',
      payload: {
        content,
        temp_id: tempId,  // 传递临时消息ID给后端
      },
    };

    console.log('Sending to WebSocket:', message);
    websocketApi.sendMessage(socket, message);
  },

  // 连接WebSocket
  connectWebSocket: (token) => {
    try {
      const currentSocket = get().socket;
      // 检查是否已经存在一个活跃的WebSocket连接
      if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected, closing existing connection...');
        websocketApi.closeConnection(currentSocket);
      }
      
      console.log('Connecting to WebSocket...');
      const socket = websocketApi.createConnection(token);
      console.log('WebSocket created:', socket);

      socket.onopen = () => {
        console.log('WebSocket connected');
        set({ connectionStatus: 'connected' });
        // 在WebSocket连接建立后获取历史消息
        get().fetchMessages();
      };

      socket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'chat.message' && message.data) {
            console.log('Adding chat message:', message.data);
            // 检查是否有对应的临时消息需要替换
            const chatMessage = message.data as ChatMessage;
            get().addMessage(chatMessage);
          } else if (message.type === 'users.online' && message.data) {
            // 更新在线用户列表
            console.log('Updating online users:', message.data.users);
            const onlineUsersMessage = message as OnlineUsersMessage;
            get().updateOnlineUsers(onlineUsersMessage.data.users);
          } else if (message.type === 'error' && message.data) {
            console.error('WebSocket error:', message.data.message);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        set({ connectionStatus: 'disconnected' });
      };

      socket.onclose = () => {
        console.log('WebSocket closed');
        set({ connectionStatus: 'disconnected' });
      };

      set({ socket, connectionStatus: 'connected' });
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      set({ connectionStatus: 'disconnected' });
    }
  },

  // 断开WebSocket连接
  disconnectWebSocket: () => {
    const socket = get().socket;
    if (socket) {
      websocketApi.closeConnection(socket);
      set({ socket: null, connectionStatus: 'disconnected' });
    }
  },

  // 添加消息
  addMessage: (message) => {
    set((state) => {
      console.log('Adding message:', message);
      // 检查是否存在对应的临时消息（如果是后端返回的真实消息）
      if (typeof message.id === 'number') {
        console.log('Received real message from backend:', message);
        // 查找是否有临时消息需要替换
        let tempMessageIndex = -1;
        
        // 优先使用temp_id进行精确匹配（如果后端支持返回temp_id）
        if (message.temp_id && typeof message.temp_id === 'string') {
          console.log('Looking for temp message with temp_id:', message.temp_id);
          tempMessageIndex = state.messages.findIndex(
            msg => typeof msg.id === 'string' && 
            msg.id === message.temp_id
          );
          console.log('Temp message index found:', tempMessageIndex);
        }
        
        // 如果没有temp_id或者没有找到匹配的临时消息，尝试使用内容和发送者进行匹配
        if (tempMessageIndex === -1) {
          console.log('No temp_id match, trying content and sender match');
          tempMessageIndex = state.messages.findIndex(
            msg => typeof msg.id === 'string' && 
            msg.id.startsWith('temp-') && 
            msg.content === message.content && 
            msg.sender_id === message.sender_id
          );
          console.log('Content/sender match index:', tempMessageIndex);
        }
        
        if (tempMessageIndex !== -1) {
          console.log('Replacing temp message at index:', tempMessageIndex);
          // 替换临时消息为真实消息
          const updatedMessages = [...state.messages];
          updatedMessages[tempMessageIndex] = message;
          console.log('Updated messages:', updatedMessages);
          return { messages: updatedMessages };
        } else {
          console.log('No temp message found to replace, adding as new message');
        }
      }
      
      // 如果没有找到对应的临时消息，或者本身就是临时消息，则直接添加
      console.log('Adding message to list:', message);
      return { messages: [...state.messages, message] };
    });
  },

  // 获取历史消息
  fetchMessages: async () => {
    try {
      console.log('Fetching messages...');
      set({ isLoadingMessages: true });
      const messages = await chatApi.getMessages();
      console.log('Fetched messages:', messages);
      set({ messages, isLoadingMessages: false });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      set({ isLoadingMessages: false });
    }
  },

  // 更新在线用户列表
  updateOnlineUsers: (users) => {
    set({ onlineUsers: users });
  },

  // 清除消息
  clearMessages: () => {
    set({ messages: [] });
  },
}));
