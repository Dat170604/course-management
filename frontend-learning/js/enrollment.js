import { apiFetch } from "./api.js";

export async function enrollCourse(courseId) {
    return await apiFetch(
        `/enrollments/${courseId}`,
        {
            method: "POST"
        }
    );
}

export async function unenrollCourse(courseId) {
    return await apiFetch(
        `/enrollments/${courseId}`,
        {
            method: "DELETE"
        }
    );
}

export async function MyEnrollments() {
    return await apiFetch(`/enrollments/me`,);
}