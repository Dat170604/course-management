import { Logout, handleResponse } from "./api.js";
import { getTeacherCourse, deleteCourse } from "./course.js"



const courseList = document.querySelector("#course-list")
const create_course = document.querySelector("#create-course")
const message = document.querySelector("#message")

logout.addEventListener("click", Logout)

async function loadTeacherCourses() {
    try{
        const response = await getTeacherCourse();

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        if (data.length === 0) {
            courseList.textContent = "You don't have any courses yet.";
            return;
        }

        courseList.innerHTML = "";
        data.forEach(course => {
            const card = document.createElement("div")
            card.classList.add("course-card");
            card.innerHTML = `
                <h4>${course.title}</h4>
                <p>${course.description}</p>
                <p>Price: ${course.price}</p>
                <p>Total student: ${course.student_count}</p>
                <button id="delete-course" data-id="${course.id}">Delete</button>
            `;
            courseList.appendChild(card);
        })

        addDeleteCourseEvent();

    } catch (err) {
        console.log(err);
        courseList.textContent = "Cannot connect to server.";
    }
}

loadTeacherCourses();

create_course.addEventListener("click", () => {
    window.location.href = "create-course.html";
});

async function addDeleteCourseEvent() {
    const delete_btn = document.querySelectorAll("#delete-course");
        delete_btn.forEach(button => {
            button.addEventListener("click", () => {
                const courseId = Number(button.dataset.id);
                deleteCourses(courseId);
        })
    })
}

async function deleteCourses(courseId) {
    try {
        const response = await deleteCourse(courseId)

        const data = await handleResponse(response)

        if (data === null) {
            return;
        }

        message.textContent = "Delete Course Succesfully!"

        loadTeacherCourses();
    }   catch (error) {
        console.log(error);
        message.textContent = "Cannot connect to server.";
    }
}