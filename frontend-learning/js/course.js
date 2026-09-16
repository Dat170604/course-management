import { apiFetch } from "./api.js";

export async function getCourses({
    page = 1,
    limit = 10,
    search = "",
    minPrice = "",
    maxPrice = "",
    sort = ""
} = {}) {

    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", limit);

    if (search) {params.append("search", search)}
    if (minPrice) {params.append("min_price", minPrice)}
    if (maxPrice) {params.append("max_price", maxPrice)}
    if (sort) {params.append("sort", sort)}

    return await apiFetch(`/courses?${params.toString()}`);
}


export async function getCourse(courseId) {
    return await apiFetch(`/courses/${courseId}`);
}


export async function createCourse(courseData) {
    return await apiFetch("/courses", {
        method: "POST",
        body: JSON.stringify(courseData)
    });
}


export async function updateCourse(courseId, courseData) {
    return await apiFetch(`/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(courseData)
    });
}


export async function deleteCourse(courseId) {
    return await apiFetch(`/courses/${courseId}`, {
        method: "DELETE"
    });
}


export async function getTeacherCourse() {
    return await apiFetch(`/courses/dashboard`);
}