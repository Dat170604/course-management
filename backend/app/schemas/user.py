from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import UserRole


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str


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


class AdminGetUserResponse(BaseModel):
    students: list[UserResponse]
    teachers: list[UserResponse]
    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TeacherCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UpdateRoleRequest(BaseModel):
    role: UserRole
