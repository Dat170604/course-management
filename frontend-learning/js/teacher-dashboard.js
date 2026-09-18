import { Logout, handleResponse, getErrorMessage } from "./api.js";
import { getTeacherCourse, deleteCourse, getCourse, updateCourse } from "./course.js"
import { renderCourses, renderUsers} from "./component.js"
import { showToast } from "./toast.js";
import { requireRole } from "./auth.js";


const logout = document.querySelector("#logout")
const courseList = document.querySelector("#course-list")
const create_course = document.querySelector("#create-course")
const message = document.querySelector("#message")

const prevButton = document.querySelector("#prev-page");
const pageInfo = document.querySelector("#page-info");
const nextButton = document.querySelector("#next-page");

const searchButton = document.querySelector("#search-button")
const searchInput = document.querySelector("#search-input")


logout.addEventListener("click", Logout)


await requireRole("TEACHER")


let currentPage = 1;
const limit = 10;
let totalPages = 1;


async function loadCourses() {
    try {
        const response = await getTeacherCourse({
            page: currentPage, 
            limit: limit, 
            search: searchInput.value.trim()
        });

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        if (data.length === 0) {
            courseList.textContent = "You don't have any courses yet.";
            return;
        }

        currentPage = data.page
        totalPages = data.total_pages
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= totalPages;

        renderCourses(courseList, data.courses)
        
        const courses_card = document.querySelectorAll(".course-card")

        courses_card.forEach((card, index) => {
            const total_student = document.createElement("p")
            total_student.textContent = `Total student: ${data.courses[index].student_count}`
            card.appendChild(total_student);
        })

    } catch (err) {
        console.log(err);
        courseList.textContent = "Cannot connect to server.";
    }
}


loadCourses();


prevButton.addEventListener("click", () => {
        if (currentPage <= 1) {
            return;
        }
        currentPage--;
        loadCourses();
    }
);


nextButton.addEventListener("click", () => {
        if (currentPage >= totalPages) {
            return;
        }
        currentPage++;
        loadCourses();
    }
);


searchInput.addEventListener("input", () => {
        currentPage = 1;
        loadCourses();
    }
);


searchButton.addEventListener("click", () => {
        currentPage = 1;
        loadCourses();
    }
);


create_course.addEventListener("click", () => {
    window.location.href = "create-course.html";
});


const modal = document.querySelector("#edit-modal");
const closeModalButton = document.querySelector("#close-modal");

let currentCourseId = null;

function openModal() {
    modal.hidden = false;
}


function closeModal() {
    modal.hidden = true;
    currentCourseId = null;
}


closeModalButton.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
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
        message.textContent = getErrorMessage(response)
        showToast("Update failed", "error");
        return;
    }

    showToast("Course updated", "success");

    closeModal();

    loadCourses();
});


const deleteModal = document.querySelector("#delete-modal");
const cancelDeleteButton = document.querySelector("#cancel-delete");
const confirmDeleteButton = document.querySelector("#confirm-delete");


function openDeleteModal(courseId) {
    currentCourseId = courseId;
    deleteModal.hidden = false;
}


function closeDeleteModal() {
    deleteModal.hidden = true;
    currentCourseId = null;
}


cancelDeleteButton.addEventListener("click", closeDeleteModal);


courseList.addEventListener("click", async event => {
        
        if (event.target.classList.contains("edit-course-button")) {
            const courseId = Number(event.target.dataset.id);
            await loadCourseToForm(courseId);
            return;
        }

        if (event.target.classList.contains("delete-course-button")) {
            const courseId =Number(event.target.dataset.id);
            openDeleteModal(courseId);
            return;
        }
    }
);


confirmDeleteButton.addEventListener("click", async () => {

        if (currentCourseId === null) {
            return;
        }

        confirmDeleteButton.disabled = true;
        confirmDeleteButton.textContent = "Deleting...";

        try {
            const response = await deleteCourse(currentCourseId);

            if (!response.ok) {
                showToast("Delete failed", "error");
                return;
            }

            closeDeleteModal();

            loadCourses();
            
        }   finally {
            confirmDeleteButton.disabled = false;
            confirmDeleteButton.textContent = "Delete";
        } 
    }
);


deleteModal.addEventListener("click",event => {
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    }
);

document.addEventListener("keydown",event => {
        if (event.key === "Escape") {
            closeDeleteModal();
            closeModal();
        }
    }
);