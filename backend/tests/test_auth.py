def test_get_current_teacher(client, teacher_auth_headers):
    response = client.get(
        "/auth/me", headers={"Authorization": teacher_auth_headers["Authorization"]}
    )

    assert response.status_code == 200, response.json()


def test_get_current_student(client, student_auth_headers):
    response = client.get(
        "/auth/me", headers={"Authorization": student_auth_headers["Authorization"]}
    )

    assert response.status_code == 200, response.json()


def test_get_current_user_invalid_token(client):
    headers = {"Authorization": "Bearer invalid_token"}

    response = client.get("/auth/me", headers=headers)

    assert response.status_code == 401, response.json()


def test_refresh_token(client, student_auth_headers):

    refresh_token = student_auth_headers["refresh_token"]

    response = client.post("/auth/refresh", json={"refresh_token": refresh_token})

    assert response.status_code == 200, response.json()

    assert "access_token" in response.json()


def test_access_token_cannot_refresh(client, student):
    login = client.post(
        "/auth/login", json={"email": student.email, "password": "student"}
    )

    access_token = login.json()["access_token"]

    response = client.post("/auth/refresh", json={"refresh_token": access_token})

    assert response.status_code == 401


def test_refresh_after_logout(client, student):
    login = client.post(
        "/auth/login", json={"email": student.email, "password": "student"}
    )

    refresh_token = login.json()["refresh_token"]

    logout = client.post("/auth/logout", json={"refresh_token": refresh_token})

    assert logout.status_code == 200

    response = client.post("/auth/refresh", json={"refresh_token": refresh_token})

    assert response.status_code == 401


def test_account_login(client, student):
    response = client.post(
        "/auth/login", json={"email": student.email, "password": "student"}
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()

    response = client.post(
        "/auth/login", json={"email": "student@gmail.com", "password": "student"}
    )

    assert response.status_code == 401

    response = client.post(
        "/auth/login", json={"email": student.email, "password": "wrong_password"}
    )
    assert response.status_code == 401


def test_account_register(client, student):
    response = client.post(
        "/auth/register",
        json={
            "username": "newstudent",
            "email": "newstudent@gmail.com",
            "password": "newstudent",
        },
    )

    assert response.status_code == 200

    response = client.post(
        "/auth/register",
        json={
            "username": "existingstudent",
            "email": student.email,
            "password": "student",
        },
    )

    assert response.status_code == 400
