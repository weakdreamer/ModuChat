from sqlalchemy.ext.declarative import declarative_base

# 创建基础模型类
Base = declarative_base()

# 导入所有模型，确保它们被Base.metadata捕获
from app.models.user import User
from app.models.message import Message
