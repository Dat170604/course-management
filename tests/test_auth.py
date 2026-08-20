def test_get_current_teacher(client, teacher_auth_headers):
    response = client.get(
        "/auth/me",
        headers=teacher_auth_headers
    )

    assert response.status_code == 200


def test_get_current_student(client, student_auth_headers):
    response = client.get(
        "/auth/me",
        headers=student_auth_headers
    )

    assert response.status_code == 200


def test_get_current_user_invalid_token(client):
    headers = {
        "Authorization": "Bearer invalid_token"
    }

    response = client.get(
        "/auth/me",
        headers=headers
    )

    assert response.status_code == 401

    