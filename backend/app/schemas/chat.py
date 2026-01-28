from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# 客户端发送消息请求模型
class ChatMessageSend(BaseModel):
    type: str = Field(default="chat.text", description="消息类型")
    payload: dict = Field(..., description="消息内容")

# 服务端广播消息响应模型
class ChatMessageBroadcast(BaseModel):
    type: str = Field(default="chat.message", description="消息类型")
    data: dict = Field(..., description="消息数据")

# 消息内容详细模型
class MessageData(BaseModel):
    id: int = Field(..., description="消息ID")
    sender_id: int = Field(..., description="发送者ID")
    sender_name: str = Field(..., description="发送者名称")
    content: str = Field(..., description="消息内容")
    message_type: str = Field(default="text", description="消息类型")
    timestamp: datetime = Field(..., description="发送时间")

# 连接状态更新模型
class ConnectionStatusUpdate(BaseModel):
    type: str = Field(default="connection.status", description="消息类型")
    data: dict = Field(..., description="连接状态数据")

# 错误消息模型
class ErrorMessage(BaseModel):
    type: str = Field(default="error", description="消息类型")
    data: dict = Field(..., description="错误数据")

# 在线用户列表消息模型
class OnlineUsersMessage(BaseModel):
    type: str = Field(default="users.online", description="消息类型")
    data: dict = Field(..., description="在线用户数据")
