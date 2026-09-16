import { Logout, handleResponse } from "./api.js";
import { getTeacherCourse, deleteCourse, getCourse, updateCourse } from "./course.js"
import { renderCourses, renderUsers} from "./component.js"


const logout = document.querySelector("#logout")
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

        renderCourses(courseList, data)
        
        const courses_card = document.querySelectorAll(".course-card")

        courses_card.forEach((card, index) => {
            const total_student = document.createElement("p")
            total_student.textContent = `Total student: ${data[index].student_count}`
            
            const deleteButton = document.createElement("button")
            deleteButton.classList.add("delete-course-button")
            deleteButton.textContent = "Delete"
            deleteButton.dataset.id = data[index].id;

            const editButton = document.createElement("button");
            editButton.classList.add("edit-course-button");
            editButton.dataset.id = data[index].id;
            editButton.textContent = "Edit";
            card.append(total_student, deleteButton, editButton)
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
    const delete_btn = document.querySelectorAll(".delete-course-button");
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

const modal = document.querySelector("#edit-modal");
const closeModalButton = document.querySelector("#close-modal");
let currentCourseId = null;

function openModal() {
    modal.hidden = false;
}


function closeModal() {
    modal.hidden = true;
}


closeModalButton.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});


async function loadCourseToForm(courseId) {

    currentCourseId = courseId;

    const response = await getCourse(courseId);

    if (!response.ok) {
        alert("Cannot get course");
        return;
    }

    const data = await response.json();

    if (data === null) {
        return;
    }

    document.querySelector("#edit-title").value = data.title;
    document.querySelector("#edit-description").value = data.description;
    document.querySelector("#edit-price").value = data.price;

    openModal();
}


courseList.addEventListener("click", async event => {

    if (!event.target.classList.contains("edit-course-button")) {
        return;
    }

    const courseId = Number(event.target.dataset.id);

    await loadCourseToForm(courseId);
});


const editForm = document.querySelector("#edit-course-form");

editForm.addEventListener("submit", async event => {

    event.preventDefault();

    const courseData = {
        title: document.querySelector("#edit-title").value.trim(),
        description: document.querySelector("#edit-description").value.trim(),
        price: Number(document.querySelector("#edit-price").value)
    };

    const response = await updateCourse(currentCourseId, courseData);

    if (!response.ok) {
        alert("Update failed");
        return;
    }

    alert("Course updated");

    closeModal();

    loadTeacherCourses();
});