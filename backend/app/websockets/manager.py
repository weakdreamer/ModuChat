from typing import Dict, List, Set, Optional
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        # 存储所有活跃的WebSocket连接
        self.active_connections: Set[WebSocket] = set()
        # 存储用户ID与WebSocket连接的映射
        self.user_connections: Dict[int, WebSocket] = {}
        # 存储WebSocket连接与用户ID的映射
        self.connection_users: Dict[WebSocket, int] = {}
    
    async def connect(self, websocket: WebSocket, user_id: int):
        """接受新的WebSocket连接"""
        await websocket.accept()
        self.active_connections.add(websocket)
        self.user_connections[user_id] = websocket
        self.connection_users[websocket] = user_id
    
    def disconnect(self, websocket: WebSocket):
        """断开WebSocket连接"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        if websocket in self.connection_users:
            user_id = self.connection_users[websocket]
            del self.connection_users[websocket]
            
            if user_id in self.user_connections:
                del self.user_connections[user_id]
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """发送私人消息给特定用户"""
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        """广播消息给所有连接的用户"""
        for connection in self.active_connections.copy():
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"发送消息失败: {e}")
                self.disconnect(connection)
    
    async def send_to_user(self, message: str, user_id: int):
        """发送消息给特定用户"""
        if user_id in self.user_connections:
            websocket = self.user_connections[user_id]
            try:
                await websocket.send_text(message)
                return True
            except Exception as e:
                print(f"发送私人消息失败: {e}")
                self.disconnect(websocket)
                return False
        return False
    
    def get_online_users(self) -> Set[int]:
        """获取所有在线用户的ID"""
        return set(self.user_connections.keys())

# 创建全局的连接管理器实例
manager = ConnectionManager()
