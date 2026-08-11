from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Float
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship

from sqlalchemy.sql import func

from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer,primary_key=True,index=True)
    title = Column(String(200),nullable=False)
    description = Column(Text)
    price = Column(Float,default=0)
    teacher_id = Column(Integer,ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
    teacher = relationship("User",back_populates="courses")
    enrollments = relationship("Enrollment",back_populates="course")