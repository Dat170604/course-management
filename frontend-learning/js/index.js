import { apiFetch, handleResponse } from "./api.js";

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

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        showRole(data.role, data.username);
    } catch (err){
        console.error(err);  
    }
}

loadUser();


