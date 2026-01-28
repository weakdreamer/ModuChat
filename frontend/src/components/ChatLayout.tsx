import React, { useState, useRef, useEffect } from 'react'
import UserList from './UserList'
import ChatBubble from './ChatBubble'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'

interface ChatLayoutProps {
  // 可以添加props
}

const ChatLayout: React.FC<ChatLayoutProps> = () => {
  const { messages, sendMessage, connectionStatus, disconnectWebSocket, fetchMessages } = useChatStore()
  const { user, logout } = useAuthStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 处理登出
  const handleLogout = () => {
    // 断开WebSocket连接
    disconnectWebSocket()
    // 登出
    logout()
  }

  // 获取历史消息
  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    sendMessage(inputValue.trim())
    setInputValue('')
  }

  // 处理回车键发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧用户列表 */}
      <div className="w-64 glass-effect border-r border-gray-700">
        <UserList />
      </div>
      
      {/* 右侧聊天区 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天头部 */}
        <div className="h-16 glass-effect border-b border-gray-700 flex items-center justify-between px-4">
          <div>
            <h2 className="text-xl font-semibold">ModuChat</h2>
            <div className={`text-xs mt-1 ${connectionStatus === 'connected' ? 'text-green-500' : connectionStatus === 'reconnecting' ? 'text-yellow-500' : 'text-red-500'}`}>
              {connectionStatus === 'connected' && '已连接'}
              {connectionStatus === 'reconnecting' && '正在重连...'}
              {connectionStatus === 'disconnected' && '连接已断开'}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-medium">{user?.username.charAt(0) || 'U'}</span>
            </div>
            <div>
              <div className="text-sm font-medium">{user?.username || '用户'}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              title="登出"
            >
              登出
            </button>
          </div>
        </div>
        
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>没有消息，开始聊天吧！</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatBubble 
                key={message.id} 
                content={message.content} 
                senderName={message.sender_name} 
                isOwnMessage={message.sender_id === user?.id} 
                timestamp={new Date(message.timestamp).toLocaleTimeString()} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* 输入区域 */}
        <div className="h-24 glass-effect border-t border-gray-700 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="输入消息... (Shift+Enter换行)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim()}
              className={`px-6 py-2 rounded-lg transition-colors ${inputValue.trim() ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatLayout
