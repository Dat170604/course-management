from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

from app.database import Base, engine

from app.models.user import User

from app.api import auth, users, courses, enrollments, dashboard

from app.middleware.logging import logging_middleware

from app.exception.course import CourseNotFoundException
from app.exception.auth import InvalidTokenException
from app.exception.user import UserNotFoundException

from app.exception.handler import app_exception_handler

#Base.metadata.create_all(bind=engine)

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