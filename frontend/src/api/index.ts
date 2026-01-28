import axios from 'axios';
import { LoginRequest, RegisterRequest, TokenResponse, User } from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // 可以在这里跳转到登录页面
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authApi = {
  // 登录
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformRequest: (obj) => {
        const params = new URLSearchParams();
        params.append('username', obj.username);
        params.append('password', obj.password);
        return params.toString();
      },
    });
    return response.data;
  },

  // 注册
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// 聊天相关API
export const chatApi = {
  // 获取历史消息
  getMessages: async (limit = 50, offset = 0) => {
    console.log('Calling chatApi.getMessages with limit:', limit, 'offset:', offset);
    try {
      const response = await api.get('/chat/messages', {
        params: { limit, offset }
      });
      console.log('chatApi.getMessages response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('chatApi.getMessages error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },
};

// WebSocket相关API
export const websocketApi = {
  // 创建WebSocket连接
  createConnection: (token: string): WebSocket => {
    // 使用当前页面的地址作为WebSocket连接地址
    // 这样无论是本地访问还是通过natapp访问，都能正确连接
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/ws/chat?token=${token}`;
    console.log('Creating WebSocket connection to:', wsUrl);
    return new WebSocket(wsUrl);
  },

  // 发送消息
  sendMessage: (socket: WebSocket, message: any): void => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  },

  // 关闭连接
  closeConnection: (socket: WebSocket): void => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  },
};
