from app.exception.handler import AppException


class InvalidTokenException(AppException):
    def __init__(self):
        super().__init__(status_code=401, content="Invalid token")
