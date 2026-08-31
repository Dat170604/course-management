from app.exception.handler import AppException


class UserNotFoundException(AppException):
    def __init__(self):
        super().__init__(
            status_code=404,
            content= "User not found"
        )