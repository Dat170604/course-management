from sqlalchemy import Column, Integer, String
from sqlalchemy import Enum
from sqlalchemy import DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.models.enums import UserRole

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    create_at = Column(DateTime(timezone=True), server_default=func.now())
    update_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    phone = Column(String(20))
    courses = relationship(
    "Course",
    back_populates="teacher"
    )