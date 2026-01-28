from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List

from app.db.session import get_db
from app.api.deps import get_current_active_user
from app.models.message import Message
from app.models.user import User
from app.schemas.chat import MessageData

router = APIRouter(prefix="/chat", tags=["聊天"])

# 获取历史消息
@router.get("/messages", response_model=List[MessageData])
async def get_messages(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    limit: int = Query(default=50, le=100, description="获取消息的数量限制"),
    offset: int = Query(default=0, ge=0, description="消息的偏移量")
):
    # 查询最近的消息，按时间降序排列
    result = await db.execute(
        select(Message)
        .order_by(desc(Message.created_at))
        .limit(limit)
        .offset(offset)
    )
    messages = result.scalars().all()
    
    # 获取发送者信息并构建响应
    message_list = []
    for message in messages:
        sender = await db.get(User, message.sender_id)
        if sender:
            message_list.append(MessageData(
                id=message.id,
                sender_id=message.sender_id,
                sender_name=sender.username,
                content=message.content,
                message_type=message.message_type,
                timestamp=message.created_at
            ))
    
    # 反转消息列表，使最新的消息在最后
    return list(reversed(message_list))
