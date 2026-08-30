def test_student_enroll_course(
    client,
    student,
    student_auth_headers,
    course
):
    response = client.post(
        f"/enrollments/{course.id}",
        headers={"Authorization": student_auth_headers["Authorization"]}
    )

    assert response.status_code == 200, response.json()

    data = response.json()

    assert data["student_id"] == student.id
    assert data["course_id"] == course.id


def test_student_cannot_enroll_twice(
    client,
    student_auth_headers,
    course
):
    response = client.post(
        f"/enrollments/{course.id}",
        headers={"Authorization": student_auth_headers["Authorization"]}
    )

    assert response.status_code == 200, response.json()

    response = client.post(
        f"/enrollments/{course.id}",
        headers=student_auth_headers
    )

    assert response.status_code == 400


def test_enroll_course_not_found(
    client,
    student_auth_headers
):
    response = client.post(
        "/enrollments/99999",
        headers={"Authorization": student_auth_headers["Authorization"]}
    )

    assert response.status_code == 404


def test_enroll_without_login(
    client,
    course
):
    response = client.post(
        f"/enrollments/{course.id}"
    )

    assert response.status_code == 401


def test_teacher_cannot_enroll(
    client,
    teacher_auth_headers,
    course
):
    response = client.post(
        f"/enrollments/{course.id}",
        headers={"Authorization": teacher_auth_headers["Authorization"]}
    )

    assert response.status_code == 403