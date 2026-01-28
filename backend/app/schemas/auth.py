from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# 用户注册请求模型
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="用户名")
    password: str = Field(..., min_length=6, max_length=50, description="密码")

# 用户登录请求模型
class UserLogin(BaseModel):
    username: str = Field(..., description="用户名")
    password: str = Field(..., description="密码")

# 令牌响应模型
class Token(BaseModel):
    access_token: str = Field(..., description="访问令牌")
    token_type: str = Field(default="bearer", description="令牌类型")

# 令牌数据模型
class TokenData(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None

# 用户信息响应模型
class UserResponse(BaseModel):
    id: int = Field(..., description="用户ID")
    username: str = Field(..., description="用户名")
    avatar_url: Optional[str] = Field(None, description="头像URL")
    is_active: bool = Field(..., description="是否激活")
    created_at: datetime = Field(..., description="创建时间")
    
    class Config:
        from_attributes = True  # 允许从ORM模型转换
