const API_URL = "http://localhost:8000";

async function apiFetch(url, options = {}) {

    const token = localStorage.getItem("access_token");

    options = {...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                    ...(token && {"Authorization": `Bearer ${token}`})
                }
            }
    let response = await fetch(`${API_URL}${url}`,options);
    if (response.status === 401) {

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            return response;
        }

        const refreshResponse = await fetch(
            API_URL + "/auth/refresh",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({refresh_token: refreshToken})
            }
        );

        if (!refreshResponse.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "login.html";
            return response;
        }

        const data = await refreshResponse.json();

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        if (data.refresh_token) {
            localStorage.setItem(
                "refresh_token",
                data.refresh_token
            );
        }

        options.headers.Authorization =
            `Bearer ${data.access_token}`;

        response = await fetch(
            API_URL + url,
            options
        );
    }

    return response;
}

function getErrorMessage(data) {
    if (Array.isArray(data.detail)) {
        return data.detail
            .map(error => error.msg)
            .join(", ");
    }
    return data.detail || "Something went wrong";
}

async function Logout() {
    try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
            const response = await apiFetch("/auth/logout", 
                {
                    method: "POST",
                    body: JSON.stringify({refresh_token: refreshToken})
                }
            );

            if (!response.ok) {
                console.error("Logout API failed");
            }
        }

    } catch (err) {
        console.error("Logout error:", err);

    } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "index.html";
    }
}



