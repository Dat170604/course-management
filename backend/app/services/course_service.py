import json
from math import ceil

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from app.exception.course import CourseNotFoundException
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.enums import UserRole
from app.redis import redis_client
from app.schemas.course import CourseResponse


def create_course(course, current_user, db):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Only teachers can create courses")

    new_course = Course(
        title=course.title,
        description=course.description,
        price=course.price,
        teacher_id=current_user.id,
    )

    try:
        db.add(new_course)
        db.commit()
        db.refresh(new_course)

        cache_key = f"course:{new_course.id}"

        course_dict = CourseResponse.model_validate(new_course).model_dump()

        redis_client.set(cache_key, json.dumps(course_dict), ex=300)

        return new_course
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create course")


def get_courses(db, page, limit, search, min_price, max_price, teacher_id, sort):
    cache_key = (
        f"courses:"
        f"page={page}:"
        f"limit={limit}:"
        f"search={search}:"
        f"min_price={min_price}:"
        f"max_price={max_price}:"
        f"teacher_id={teacher_id}:"
        f"sort={sort}"
    )

    cached_data = redis_client.get(cache_key)

    if cached_data:
        return json.loads(cached_data)

    query = db.query(Course)

    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))

    if min_price is not None:
        query = query.filter(Course.price >= min_price)

    if max_price is not None:
        query = query.filter(Course.price <= max_price)

    if teacher_id is not None:
        query = query.filter(Course.teacher_id == teacher_id)

    if sort == "price":
        query = query.order_by(Course.price.asc())
    elif sort == "-price":
        query = query.order_by(Course.price.desc())
    else:
        query = query.order_by(Course.id.asc())

    total = query.count()

    total_pages = ceil(total / limit)

    skip = (page - 1) * limit

    courses = query.offset(skip).limit(limit).all()

    result = {
        "total": total,
        "total_pages": total_pages,
        "page": page,
        "limit": limit,
        "courses": [
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": course.price,
                "teacher_name": course.teacher.username,
                "student_count": course.student_count,
            }
            for course in courses
        ],
    }

    redis_client.set(cache_key, json.dumps(result), ex=300)

    return result


def get_course_by_id(course_id, db):
    cache_key = f"course:{course_id}"

    cache_data = redis_client.get(cache_key)

    if cache_data:
        return json.loads(cache_data)

    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise CourseNotFoundException()

    result = {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "price": course.price,
        "teacher": course.teacher.username,
    }

    redis_client.set(cache_key, json.dumps(result), ex=300)

    return result


def update_course(course_id, course_data, current_user, db):
    course = db.query(Course).filter(Course.id == course_id).first()

    if course is None:
        raise CourseNotFoundException()

    if current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot modify this course")

    data = course_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(course, key, value)

    db.commit()
    db.refresh(course)

    cache_key = f"course:{course_id}"
    redis_client.delete(cache_key)

    return course


def delete_course(course_id, current_user, db):
    course = db.query(Course).filter(Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    if current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot delete this course")

    db.query(Enrollment).filter(Enrollment.course_id == course_id).delete(
        synchronize_session=False
    )

    db.delete(course)
    db.commit()

    cache_key = f"course:{course_id}"
    redis_client.delete(cache_key)

    return {"message": "Course deleted successfully"}


def get_my_courses(current_user, db):
    courses = db.query(Course).filter(Course.teacher_id == current_user.id).all()

    return courses


def get_teacher_dashboard(current_user, db, page, limit, search):
    if current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=403, detail="Only teachers can access dashboard"
        )

    query = (
        db.query(Course, func.count(Enrollment.id).label("student_count"))
        .outerjoin(Enrollment, Enrollment.course_id == Course.id)
        .filter(Course.teacher_id == current_user.id)
        .group_by(Course.id)
    )

    if search:
        query = query.filter(Course.title.ilike(f"%{search}%"))

    total = query.count()

    total_pages = ceil(total / limit) if total > 0 else 0

    offset = (page - 1) * limit

    courses = query.offset(offset).limit(limit).all()

    result = []

    for course, student_count in courses:
        result.append(
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "price": course.price,
                "teacher_name": course.teacher.username,
                "student_count": student_count,
            }
        )
    return {
        "courses": result,
        "total": total,
        "total_pages": total_pages,
        "page": page,
        "limit": limit,
    }
