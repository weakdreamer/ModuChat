import { useEffect } from 'react'
import ChatLayout from './components/ChatLayout'
import LoginForm from './components/LoginForm'
import { useAuthStore } from './store/useAuthStore'
import { useChatStore } from './store/useChatStore'

function App() {
  const { isAuthenticated, isLoading, error, login, register } = useAuthStore()
  const { connectWebSocket, disconnectWebSocket } = useChatStore()

  // 当用户认证状态变化时，管理WebSocket连接
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    
    // 检查localStorage中的用户信息
    console.log('localStorage user_id:', localStorage.getItem('user_id'));
    console.log('localStorage user_username:', localStorage.getItem('user_username'));
    console.log('localStorage user:', localStorage.getItem('user'));
    
    if (isAuthenticated && token) {
      // 连接WebSocket
      connectWebSocket(token)
    } else {
      // 断开WebSocket
      disconnectWebSocket()
    }
    
    // 清理函数
    return () => {
      disconnectWebSocket()
    }
  }, [isAuthenticated])

  // 处理登录
  const handleLogin = async (username: string, password: string) => {
    try {
      await login({ username, password })
    } catch (err) {
      console.error('登录失败:', err)
    }
  }

  // 处理注册
  const handleRegister = async (username: string, password: string) => {
    try {
      await register({ username, password })
    } catch (err) {
      console.error('注册失败:', err)
    }
  }

  return (
    <div className="bg-gray-900 text-white h-screen overflow-hidden">
      {isAuthenticated ? (
        <ChatLayout />
      ) : (
        <LoginForm onLogin={handleLogin} onRegister={handleRegister} isLoading={isLoading} error={error} />
      )}
    </div>
  )
}

export default App
