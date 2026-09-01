import time

from fastapi import Request


async def logging_middleware(request: Request, call_next):
    start_time = time.time()

    print(f"Request: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time

    print(f"Status: {response.status_code}")

    print(f"Process time: {process_time}")

    return response
