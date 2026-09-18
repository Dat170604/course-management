import { createCourse } from "./course.js"
import { handleResponse } from "./api.js";


const courseForm = document.querySelector(".course-form");

const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector("#price");

const message = document.querySelector("#message");

const cancelButton = document.querySelector("#cancel-button");

async function createCourses(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = Number(priceInput.value);

    if (!title || !description || price < 0) {
        message.textContent = "Please enter valid information.";
        return;
    }

    const courseData = {title, description, price}
    try {
        const response = await createCourse(courseData)

        const data = await handleResponse(response)

        if (data === null) {
            return;
        } 

        message.textContent = "Course created successfully!";

        setTimeout(() => {
            window.location.href = "teacher-dashboard.html";
        }, 1000);
    } catch (err) {
        console.log(err);
        message.textContent = "Cannot connect to server."
    }
}

courseForm.addEventListener("submit", createCourses)

cancelButton.addEventListener("click", () => {

    window.location.href = "teacher-dashboard.html";

});