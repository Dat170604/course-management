def test_get_all_courses(client):

    response = client.get("/courses/")

    assert response.status_code == 200, response.json()

    data = response.json()

    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "courses" in data

    assert isinstance(data["courses"], list)


def test_get_course(client, course):
    response = client.get(f"/courses/{course.id}")

    assert response.status_code == 200, response.json()

    data = response.json()

    assert data["id"] == course.id
    assert data["title"] == course.title

    response = client.get("/courses/9999")

    assert response.status_code == 404


def test_create_course(client, teacher_auth_headers):
    response = client.post(
        "/courses/",
        headers={"Authorization": teacher_auth_headers["Authorization"]},
        json={
            "title": "Test Course",
            "description": "This is a test course.",
            "price": 100,
        },
    )

    assert response.status_code == 200, response.json()
    data = response.json()
    assert data["title"] == "Test Course"
    assert data["description"] == "This is a test course."
    assert data["price"] == 100

def test_create_course_unauthorized(client):
    response = client.post(
        "/courses/",
        json={
            "title": "Test Course",
            "description": "This is a test course.",
            "price": 100,
        },
    )

    assert response.status_code == 401, response.json()

def test_create_course_forbidden(client, student_auth_headers):
    response = client.post(
        "/courses/",
        headers={"Authorization": student_auth_headers["Authorization"]},
        json={
            "title": "Test Course",
            "description": "This is a test course.",
            "price": 100,
        },
    )

    assert response.status_code == 403, response.json()

def test_update_course(client, teacher_auth_headers, course):
    response = client.put(
        f"/courses/{course.id}",
        headers={"Authorization": teacher_auth_headers["Authorization"]},
        json={
            "title": "Updated Course",
            "description": "This is an updated test course.",
            "price": 150,
        },
    )

    assert response.status_code == 200, response.json()
    data = response.json()
    assert data["title"] == "Updated Course"
    assert data["description"] == "This is an updated test course."
    assert data["price"] == 150

def test_update_course_unauthorized(client, course):
    response = client.put(
        f"/courses/{course.id}",
        json={
            "title": "Updated Course",
            "description": "This is an updated test course.",
            "price": 150,
        },
    )

    assert response.status_code == 401, response.json()

def test_update_course_forbidden(client, student_auth_headers, course):
    response = client.put(
        f"/courses/{course.id}",
        headers={"Authorization": student_auth_headers["Authorization"]},
        json={
            "title": "Updated Course",
            "description": "This is an updated test course.",
            "price": 150,
        },
    )

    assert response.status_code == 403, response.json()

