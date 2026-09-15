import { requireRole } from "./auth.js";
import { apiFetch, Logout, handleResponse } from "./api.js";
import { adminDashboard, getUsers, deleteUser, updateUserRole} from "./user.js"
import { getCourses, deleteCourse } from "./course.js"


const logout = document.querySelector("#logout")
const message = document.querySelector("#message")

const totalUser = document.querySelector("#total-users")
const totalStudent = document.querySelector("#total-students")
const totalTeacher = document.querySelector("#total-teachers")
const totalCourse = document.querySelector("#total-courses")
const totalEnrollment = document.querySelector("#total-enrollments")

const students = document.querySelector("#student-list")
const teachers = document.querySelector("#teacher-list")

const courseList = document.querySelector("#course-list")

const loading = document.querySelector("#loading");
const emptyMessage = document.querySelector("#empty-message");

const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const pageInfo = document.querySelector("#page-info");

const searchInput = document.querySelector("#search-input");
const minPriceInput = document.querySelector("#min-price");
const maxPriceInput = document.querySelector("#max-price");
const sortPrice = document.querySelector("#sort-price");
const searchButton = document.querySelector("#search-button");

async function init() {
    const user = await requireRole("ADMIN");

    if (!user) {
        return;
    }

    console.log("Welcome", user.username);

    loadStatistics();
    loadUsers();
    loadCourses();
    
}

init();

logout.addEventListener("click", Logout)

async function loadStatistics() {
    try {
        const response = await adminDashboard()

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        totalUser.textContent = Number(data.total_students) + Number(data.total_teachers)
        totalStudent.textContent = data.total_students
        totalTeacher.textContent = data.total_teachers
        totalCourse.textContent = data.total_courses
        totalEnrollment.textContent = data.total_enrollments

    } catch (err) {
        console.log(err)
        message.textContent = "Cannot connect to server."
    }
}


async function loadUsers() {
    message.textContent = ""
    try {
        const response = await getUsers()

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }
        
        data.students.forEach((user, index) => {
            const card = document.createElement("div");
            card.classList.add("user-card");
            card.innerHTML = `
            <p>${index + 1}</p>
            <p>${user.username}</p>
            <p>${user.email}</p>
            <p>${user.role}
            <button 
            id="delete-user"
            data-id="${user.id}">
            Delete</button>
            `;

            students.appendChild(card)
        })

        data.teachers.forEach((user, index) => {
            const card = document.createElement("div");
            card.classList.add("user-card");
            card.innerHTML = `
            <p>${index + 1}</p>
            <p>${user.username}</p>
            <p>${user.email}</p>
            <p>${user.role}
            <button 
            id="delete-user"
            data-id="${user.id}">
            Delete</button>
            `;

            teachers.appendChild(card)
        })

        addDeleteUserEvent();

    } catch (err) {
        console.log(err)
        message.textContent = "Cannot connect to server."
    }
}

async function addDeleteUserEvent() {
    const buttons = document.querySelectorAll(".delete-user");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const userId = Number(button.dataset.id);

            deleteUsers(userId);
        });
    });
}

async function deleteUsers(userId) {
    try {
        const response = await deleteUser(userId)

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        message.textContent = "Deleted User Succesfully"

        await loadUsers();
    } catch (error) {
        console.log(error);
        message.textContent = "Can't connect to server."
    }
}


let currentPage = 1;
const limit = 10;
let totalPages = 1;

let currentSearch = "";
let currentMinPrice = "";
let currentMaxPrice = "";
let currentSort = "";

async function loadCourses(page=1) {

    loading.hidden = false;
    emptyMessage.hidden = true;

    courseList.innerHTML = ""

    try {
        
        const response = await getCourses({
            page: page,
            limit: limit,
            search: currentSearch,
            minPrice: currentMinPrice,
            maxPrice: currentMaxPrice,
            sort: currentSort
        });

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        if (data.courses.length === 0) {
            emptyMessage.hidden = false;
            return;
        }
        
        data.courses.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");
            card.innerHTML = `
            <p>Title: ${course.title}</p>
            <p>Description: ${course.description}</p>
            <p>Price: ${course.price}</p>
            <p>Teacher: ${course.teacher_id}</p>
            <button 
            id="delete-course"
            data-id=${course.id}>
            Delete</button>
            `;

            courseList.appendChild(card)
        })

        currentPage = data.page;
        totalPages = data.total_pages;

        pageInfo.textContent =`Page ${currentPage} / ${totalPages}`;

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        addDeleteCourseEvent();

    } catch (err) {
        console.log(err)
        message.textContent = "Cannot connect to server."
    }   finally {
        loading.hidden = true;
    }
}


prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        loadCourses(currentPage - 1);
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        loadCourses(currentPage + 1);
    }
});

function applyFilters() {
    currentSearch = searchInput.value.trim();
    currentMinPrice = minPriceInput.value;
    currentMaxPrice = maxPriceInput.value;
    currentSort = sortPrice.value;
    currentPage = 1;
    loadCourses(currentPage);
}

searchButton.addEventListener("click", applyFilters);

let searchTimer;

function handleFilterChange() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        applyFilters();
    }, 500);
}

searchInput.addEventListener("input", handleFilterChange);
minPriceInput.addEventListener("input", handleFilterChange);
maxPriceInput.addEventListener("input", handleFilterChange);
sortPrice.addEventListener("change", handleFilterChange);

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        loadCourses(currentPage);
    }, 500);
});


async function addDeleteCourseEvent() {
    const buttons = document.querySelectorAll("#delete-course")

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const courseId = Number(button.dataset.id)
        
            deleteCourses(courseId)
        })  
    })
}


async function deleteCourses(courseId) {
    try {
        const response = await deleteCourse(courseId)

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        message.textContent = "Deleted Course Succesfully"

        await loadCourse();
    } catch (error) {
        console.log(error);
        message.textContent = "Can't connect to server."
    }
}

