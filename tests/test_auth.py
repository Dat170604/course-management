def test_get_current_user(client, auth_headers):

    response = client.get(
        "/auth/me",
        headers=auth_headers
    )
    assert response.status_code == 200


def test_get_current_user_without_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401


def test_get_current_user_invalid_token(client):
    headers = {
        "Authorization": "Bearer invalid_token"
    }

    response = client.get(
        "/auth/me",
        headers=headers
    )

    assert response.status_code == 401