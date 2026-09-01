from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, courses, dashboard, enrollments, users
from app.exception.auth import InvalidTokenException
from app.exception.course import CourseNotFoundException
from app.exception.handler import app_exception_handler
from app.exception.user import UserNotFoundException
from app.middleware.logging import logging_middleware

# Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(dashboard.router)

app.middleware("http")(logging_middleware)

app.add_exception_handler(CourseNotFoundException, app_exception_handler)
app.add_exception_handler(InvalidTokenException, app_exception_handler)
app.add_exception_handler(UserNotFoundException, app_exception_handler)


@app.get("/")
def root():
    return {"message": "Hello"}
