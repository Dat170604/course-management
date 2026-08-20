def test_student_enroll_course(client, student_auth_headers, student, course):

    response = client.post(
        f"/enrollments/{course.id}",
        headers=student_auth_headers
    )

    assert response.status_code == 200
    data = response.json()
    assert data["student_id"] == student.id
    assert data["course_id"] == course.id
