
def test_get_courses(client):
    response = client.get("/courses/")

    assert response.status_code == 200