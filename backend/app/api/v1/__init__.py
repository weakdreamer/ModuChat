from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.chat import router as chat_router

# 创建API v1路由
api_router = APIRouter(prefix="/api/v1")

# 注册认证路由
api_router.include_router(auth_router, tags=["认证"])
# 注册聊天路由
api_router.include_router(chat_router, tags=["聊天"])

__all__ = ["api_router"]
