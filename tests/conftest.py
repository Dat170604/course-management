import os

os.environ["TESTING"] = "true"

import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base
from app.dependencies import get_db

from app.models.user import User, UserRole
from app.models.course import Course
from app.models.enrollment import Enrollment

from app.core.security import hash_password
from app.redis import redis_client


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"


engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


@pytest.fixture(autouse=True)
def setup_database():
    
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    redis_client.flushdb()

    yield

    redis_client.flushdb()
    
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db():

    database = TestingSessionLocal()

    try:
        yield database
    finally:
        database.close()


@pytest.fixture
def client(db):

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

@pytest.fixture
def teacher(db):
    user = User(
        username = "teacher_test",
        email = "teacher_test@gmail.com",
        password = hash_password("teacher"),
        role = UserRole.TEACHER
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def student(db):
    user = User(
        username = "student_test",
        email = "student_test@gmail.com",
        password = hash_password("student"),
        role = UserRole.STUDENT
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def teacher_auth_headers(client, teacher):
    response = client.post(
        "/auth/login",
        json={
            "email": teacher.email,
            "password": "teacher"
        }
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert "access_token" in data, data
    assert "refresh_token" in data, data

    return {
        "Authorization": f"Bearer {data['access_token']}",
        "refresh_token": data['refresh_token']
    }


@pytest.fixture
def student_auth_headers(client, student):
    response = client.post(
        "/auth/login",
        json={
            "email": student.email,
            "password": "student"
        }
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert "access_token" in data, data
    assert "refresh_token" in data, data

    return {
        "Authorization": f"Bearer {data['access_token']}",
        "refresh_token": data['refresh_token']
    }


@pytest.fixture
def course(db, teacher):
    course = Course(
        title="Python FastAPI",
        description="Learn FastAPI",
        price=100000,
        teacher_id=teacher.id
    )

    db.add(course)
    db.commit()
    db.refresh(course)

    return course