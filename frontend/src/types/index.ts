// 用户相关类型
export interface User {
  id: number;
  username: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

// 消息相关类型
export interface Message {
  id: number;
  sender_id: number;
  content: string;
  message_type: string;
  created_at: string;
  sender_name?: string;
}

// 聊天消息类型
export interface ChatMessage {
  id: number | string;
  sender_id: number;
  sender_name: string;
  content: string;
  message_type: string;
  timestamp: string;
  temp_id?: string;  // 临时消息ID，用于精确匹配和替换
}

// 登录相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// WebSocket相关类型
export interface WebSocketMessage {
  type: string;
  data?: any;
  payload?: any;
}

export interface WebSocketChatMessage {
  type: 'chat.text';
  payload: {
    content: string;
  };
}

export interface WebSocketBroadcastMessage {
  type: 'chat.message';
  data: ChatMessage;
}

export interface ConnectionStatusUpdate {
  type: 'connection.status';
  data: {
    status: 'connected' | 'disconnected' | 'reconnecting';
    message?: string;
  };
}

export interface ErrorMessage {
  type: 'error';
  data: {
    message: string;
  };
}

// 在线用户相关类型
export interface OnlineUser {
  id: number;
  username: string;
  is_online: boolean;
}

export interface OnlineUsersMessage {
  type: 'users.online';
  data: {
    users: OnlineUser[];
  };
}
