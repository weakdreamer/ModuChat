import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          localStorage.setItem('access_token', response.access_token);
          
          // 获取用户信息
          const user = await authApi.getCurrentUser();
          
          // 保存用户ID和用户名到localStorage，用于聊天功能
          if (user) {
            localStorage.setItem('user_id', user.id.toString());
            localStorage.setItem('user_username', user.username);
            localStorage.setItem('user', JSON.stringify(user));
          }
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || '登录失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      // 注册
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register(userData);
          
          // 自动登录
          await get().login({
            username: userData.username,
            password: userData.password
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.detail || '注册失败', 
            isLoading: false 
          });
          throw error;
        }
      },

      // 登出
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_username');
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      // 清除错误
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
