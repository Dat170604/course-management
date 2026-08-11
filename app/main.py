from fastapi import FastAPI

from app.database import Base, engine

from app.models.user import User

from app.api import auth, users, courses, enrollments

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(enrollments.router)

@app.get("/")
def root():
    return {"message": "Hello"}
