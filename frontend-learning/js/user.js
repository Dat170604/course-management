import { apiFetch } from "./api.js";

export async function adminDashboard() {
    return await apiFetch("/dashboard/admin");
}

export async function getUsers() {
    return await apiFetch("/users");
}

export async function deleteUser(userId) {
    return await apiFetch(`/users/${userId}`, {
        method: "DELETE"
    });
}

export async function updateUserRole(userId, role) {
    return await apiFetch(`/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({
            role: role
        })
    });
}