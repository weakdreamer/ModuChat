from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
import json

from app.db.session import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.models.message import Message
from app.schemas.chat import ChatMessageSend, ChatMessageBroadcast, MessageData, ErrorMessage, OnlineUsersMessage
from app.websockets.manager import manager

router = APIRouter()

# WebSocket连接端点
@router.websocket("/ws/chat")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    # 验证Token
    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=4001)
        return
    
    user_id = int(payload.get("sub"))
    
    # 获取用户信息
    user = await db.get(User, user_id)
    if not user or not user.is_active:
        await websocket.close(code=4001)
        return
    
    # 接受连接
    await manager.connect(websocket, user_id)
    
    # 创建当前用户的在线信息
    current_user_info = {
        "id": user.id,
        "username": user.username,
        "is_online": True
    }
    
    # 获取其他在线用户的ID
    online_user_ids = manager.get_online_users()
    online_user_ids.remove(user_id)  # 移除当前用户ID，避免重复
    
    # 获取其他在线用户的详细信息
    online_users = [current_user_info]  # 先添加当前用户
    for online_user_id in online_user_ids:
        online_user = await db.get(User, online_user_id)
        if online_user:
            online_users.append({
                "id": online_user.id,
                "username": online_user.username,
                "is_online": True
            })
    
    # 广播在线用户列表给所有连接的用户
    online_users_message = OnlineUsersMessage(
        data={"users": online_users}
    )
    await manager.broadcast(online_users_message.model_dump_json())
    
    try:
        while True:
            # 接收消息
            data = await websocket.receive_text()
            print(f"接收到WebSocket消息: {data}")
            
            try:
                # 解析消息
                message_data = json.loads(data)
                chat_message = ChatMessageSend(**message_data)
                
                if chat_message.type == "chat.text":
                    # 处理文本消息
                    content = chat_message.payload.get("content", "")
                    temp_id = chat_message.payload.get("temp_id")  # 获取前端发送的临时消息ID
                    
                    if not content.strip():
                        # 发送错误消息
                        error_msg = ErrorMessage(
                            data={"message": "消息内容不能为空"}
                        )
                        await manager.send_personal_message(
                            error_msg.model_dump_json(),
                            websocket
                        )
                        continue
                    
                    # 保存消息到数据库
                    new_message = Message(
                        sender_id=user_id,
                        content=content,
                        message_type="text"
                    )
                    
                    db.add(new_message)
                    await db.commit()
                    await db.refresh(new_message)
                    print(f"保存消息成功: {new_message.id}")
                    
                    # 构建广播消息，包含temp_id
                    message_data = MessageData(
                        id=new_message.id,
                        sender_id=user_id,
                        sender_name=user.username,
                        content=content,
                        message_type="text",
                        timestamp=new_message.created_at
                    ).model_dump()
                    
                    # 添加temp_id到消息数据中
                    if temp_id:
                        message_data["temp_id"] = temp_id
                        print(f"Including temp_id in broadcast: {temp_id}")
                    
                    # 构建广播消息
                    message_broadcast = ChatMessageBroadcast(
                        data=message_data
                    )
                    
                    # 广播消息给所有用户
                    broadcast_data = message_broadcast.model_dump_json()
                    print(f"广播消息: {broadcast_data}")
                    await manager.broadcast(broadcast_data)
                    
            except json.JSONDecodeError:
                # 发送错误消息
                error_msg = ErrorMessage(
                    data={"message": "无效的JSON格式"}
                )
                await manager.send_personal_message(
                    error_msg.model_dump_json(),
                    websocket
                )
            except Exception as e:
                # 发送错误消息
                print(f"处理消息时出错: {str(e)}")
                error_msg = ErrorMessage(
                    data={"message": f"处理消息时出错: {str(e)}"}
                )
                await manager.send_personal_message(
                    error_msg.model_dump_json(),
                    websocket
                )
                
    except WebSocketDisconnect:
        # 用户断开连接
        manager.disconnect(websocket)
        
        # 获取更新后的所有在线用户的ID
        online_user_ids = manager.get_online_users()
        
        # 获取更新后的在线用户的详细信息
        online_users = []
        for online_user_id in online_user_ids:
            online_user = await db.get(User, online_user_id)
            if online_user:
                online_users.append({
                    "id": online_user.id,
                    "username": online_user.username,
                    "is_online": True
                })
        
        # 广播更新后的在线用户列表给所有连接的用户
        online_users_message = OnlineUsersMessage(
            data={"users": online_users}
        )
        await manager.broadcast(online_users_message.model_dump_json())
    except Exception as e:
        # 其他异常
        print(f"WebSocket错误: {e}")
        manager.disconnect(websocket)
