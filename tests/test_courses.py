
def test_get_courses(client):
    response = client.get("/courses/")

    assert response.status_code == 200

def test_get_course(client, course):
    response = client.get(
        f"/courses/{course.id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == course.id
    assert data["title"] == "Python FastAPI"

def test_create_course(client, teacher_auth_headers):
    response = client.post(
        "/courses/",
        headers=teacher_auth_headers,
        json={
            "title": "Test Course",
            "description": "This is a test course.",
            "price": 100
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Course"
    assert data["description"] == "This is a test course."
    assert data["price"] == 100