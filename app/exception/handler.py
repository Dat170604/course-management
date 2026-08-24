from fastapi import Request
from fastapi.responses import JSONResponse

from app.exception.course import CourseNotFoundException

async def course_not_found_handler(
    request: Request, 
    exc: CourseNotFoundException
):
    return JSONResponse(
        status_code=404,
        content={"message": "Course not found"}
    )