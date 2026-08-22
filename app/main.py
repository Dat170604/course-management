from fastapi import FastAPI, Request

import time

from app.database import Base, engine

from app.models.user import User

from app.api import auth, users, courses, enrollments, dashboard

from app.middleware.logging import logging_middleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(dashboard.router)

app.middleware("http")(logging_middleware)

@app.get("/")
def root():
    return {"message": "Hello"}