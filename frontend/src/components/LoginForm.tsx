import React, { useState } from 'react'

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>
  onRegister: (username: string, password: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister, isLoading, error }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isRegistering) {
        await onRegister(username, password)
      } else {
        await onLogin(username, password)
      }
    } catch (err) {
      // 错误已在App组件中处理
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-800 relative overflow-hidden">
      {/* 装饰性圆形 */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* 登录表单 */}
      <div className="w-full max-w-md p-8 glass-effect rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isRegistering ? '注册' : '登录'} ModuChat
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名输入 */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              用户名
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入用户名"
              required
              minLength={3}
              maxLength={50}
            />
          </div>
          
          {/* 密码输入 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="输入密码"
              required
              minLength={6}
              maxLength={50}
            />
          </div>
          
          {/* 提交按钮 */}
          <button
            type="submit"
            className={`w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (isRegistering ? '注册中...' : '登录中...') : (isRegistering ? '注册' : '登录')}
          </button>
        </form>
        
        {/* 切换登录/注册 */}
        {/* 错误信息显示 */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {/* 切换登录/注册 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isRegistering ? '已有账号？登录' : '没有账号？注册'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
