from app.exception.handler import AppException


class CourseNotFoundException(AppException):
    def __init__(self):
        super().__init__(status_code=404, message="Course not found")
