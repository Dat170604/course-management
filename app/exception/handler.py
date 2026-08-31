from fastapi import Request
from fastapi.responses import JSONResponse

from app.exception.course import CourseNotFoundException
from app.exception.auth import InvalidTokenException
from app.exception.user import UserNotFoundException


class AppException(Exception):
    def __init__(
        self,
        status_code: int,
        message: str
    ):
        self.status_code = status_code
        self.message = message
        

async def app_exception_handler(
    request: Request,
    exc: AppException
):
    return JSONResponse(
        status_code = exc.status_code,
        content = {"message": exc.message}
    )