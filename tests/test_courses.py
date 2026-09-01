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
