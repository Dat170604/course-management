import { apiFetch, Logout, getErrorMessage, handleResponse } from "./api.js";

export function isLoggedIn() {
    return !!localStorage.getItem("access_token");
}

export async function getCurrentUser() {
    const response = await apiFetch("/auth/me");

    if (response.status === 401) {
        Logout();
        return null;
    }

    const data = await handleResponse(response);

        if (data === null) {
            return;
        }

    return data;
}

export async function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
        return null;
    }

    try {
        return await getCurrentUser();
    } catch (error) {
        console.error(error);

        window.location.href = "login.html";

        return null;
    }
}

export async function requireRole(role) {
    const user = await requireAuth();

    if (!user) {
        return null;
    }

    if (user.role !== role) {
        window.location.href = "index.html";
        return null;
    }

    return user;
}