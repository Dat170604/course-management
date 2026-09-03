# app/scripts/seed_admin.py
import os

from app.core.security import hash_password
from app.database import SessionLocal
from app.models import User, UserRole

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


def seed_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == ADMIN_USERNAME).first()
        if existing:
            print("Admin đã tồn tại")
            return

        admin = User(
            username=ADMIN_USERNAME,
            email=ADMIN_EMAIL,
            password=hash_password(ADMIN_PASSWORD),
            role=UserRole.ADMIN,
        )
        db.add(admin)
        db.commit()
        print("Đã tạo admin thành công.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
