from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.enums import UserRole

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class TeacherCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

