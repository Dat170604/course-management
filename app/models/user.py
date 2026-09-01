from sqlalchemy import Column, DateTime, Enum, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import UserRole


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    create_at = Column(DateTime(timezone=True), server_default=func.now())
    update_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    phone = Column(String(20))
    courses = relationship("Course", back_populates="teacher")
    enrollments = relationship("Enrollment", back_populates="student")
