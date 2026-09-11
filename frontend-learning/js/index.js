function showRole(role) {
    if (role === "STUDENT") {
        window.location.href = "student-dashboard.html"
    } else if (role === "TEACHER") {
        window.location.href = "teacher-dashboard.html"
    } else if (role === "ADMIN") {
        window.location.href = "admin-dashboard.html"
    }
}

async function loadUser() {

    try {
        const response = await apiFetch("/auth/me");

        const data = await response.json()

        if (!response.ok) {
            error.textContent = getErrorMessage(data);
            return;
        }

        showRole(data.role, data.username);
    } catch (err){
        console.error(err);  
    }
}

loadUser();


