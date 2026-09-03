# Course Management System

Hệ thống quản lý khóa học được xây dựng bằng **FastAPI**, hỗ trợ quản lý người dùng, khóa học và đăng ký khóa học với cơ chế xác thực và phân quyền.

## Công nghệ sử dụng

* **Backend:** Python, FastAPI
* **Database:** MySQL, SQLAlchemy
* **Caching:** Redis
* **Authentication:** JWT
* **Testing:** Pytest
* **Container:** Docker, Docker Compose
* **CI:** GitHub Actions

## Chức năng chính

* Đăng ký và đăng nhập người dùng.
* Xác thực người dùng bằng JWT Access Token và Refresh Token.
* Phân quyền theo vai trò:
  * Admin
  * Teacher
  * Student
* Admin quản lý người dùng và khóa học.
* Teacher quản lý các khóa học của mình.
* Student xem và đăng ký khóa học.
* Sử dụng Redis để cache dữ liệu khóa học.
* Giới hạn số lần đăng nhập để tăng bảo mật.
* Kiểm thử API bằng Pytest.
* Tự động chạy test thông qua GitHub Actions.

## Cài đặt và chạy

### 1. Clone project

```bash
git clone <repository-url>
cd course-management
```

### 2. Tạo file môi trường

Tạo file `.env` và cấu hình các thông tin cần thiết:

```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
```

### 3. Chạy bằng Docker Compose

```bash
docker compose up --build
```

Sau khi khởi động, API có thể được truy cập thông qua:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/docs
```

## Kiểm thử

Chạy test bằng:

```bash
pytest
```

Project cũng được cấu hình **GitHub Actions** để tự động chạy test khi push code hoặc tạo Pull Request.

## Mục tiêu dự án

Dự án được thực hiện nhằm áp dụng kiến thức về **xây dựng REST API, cơ sở dữ liệu, xác thực JWT, Redis, kiểm thử, Docker và CI/CD** vào một dự án Backend thực tế.
