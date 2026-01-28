import React from 'react'
import { useChatStore } from '../store/useChatStore'

interface UserListProps {
  // 可以添加props
}

const UserList: React.FC<UserListProps> = () => {
  // 从聊天存储中获取在线用户数据
  const { onlineUsers } = useChatStore()

  return (
    <div className="h-full flex flex-col">
      {/* 用户列表头部 */}
      <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
        <h3 className="text-lg font-medium">在线用户</h3>
        <div className="text-sm text-gray-400">{onlineUsers.filter(u => u.is_online).length} 在线</div>
      </div>
      
      {/* 用户列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-700">
          {onlineUsers.map(user => (
            <div 
              key={user.id} 
              className={`flex items-center p-3 hover:bg-gray-800 cursor-pointer transition-colors ${user.is_online ? 'bg-gray-800/50' : ''}`}
            >
              <div className="relative mr-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.is_online ? 'bg-primary' : 'bg-gray-600'}`}>
                  <span className="text-white font-medium">{user.username.charAt(0)}</span>
                </div>
                {user.is_online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-900"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{user.username}</div>
                {user.is_online && (
                  <div className="text-xs text-green-500">在线</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserList
