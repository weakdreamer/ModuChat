import React from 'react'

interface ChatBubbleProps {
  content: string
  senderName: string
  isOwnMessage: boolean
  timestamp?: string
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  content, 
  senderName, 
  isOwnMessage, 
  timestamp = new Date().toLocaleTimeString() 
}) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}>
        {/* 发送者名称 */}
        <div className={`text-sm font-medium mb-1 ${isOwnMessage ? 'text-right text-primary' : 'text-left text-gray-400'}`}>
          {senderName}
        </div>
        
        {/* 消息气泡 */}
        <div 
          className={`px-4 py-2 rounded-lg ${isOwnMessage 
            ? 'bg-primary text-white rounded-br-none' 
            : 'bg-gray-800 text-white rounded-bl-none'}`}
        >
          <p>{content}</p>
        </div>
        
        {/* 时间戳 */}
        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-right text-gray-400' : 'text-left text-gray-400'}`}>
          {timestamp}
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
