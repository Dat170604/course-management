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
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const pageInfo = document.querySelector("#page-info");

const searchInput = document.querySelector("#search-input");
const minPriceInput = document.querySelector("#min-price");
const maxPriceInput = document.querySelector("#max-price");
const sortPrice = document.querySelector("#sort-price");
const searchButton = document.querySelector("#search-button");

logout.addEventListener("click", Logout)

async function loadStatistics() {
    try {
        const response = await apiFetch("/dashboard/admin")

        const data = await response.json()

        if (!response.ok) {

            if (response.status === 401) {
                logout();
                return;
            }

            message.textContent =getErrorMessage(userData);
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

loadStatistics();

async function loadUser() {
    message.textContent = ""
    try {
        const response = await apiFetch("/dashboard/admin/users")

        const data = await response.json()

        if (!response.ok) {
            message.textContent = getErrorMessage(data);
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

            deleteUser(userId);
        });
    });
}

async function deleteUser(userId) {
    try {
        const response = await apiFetch(`/dashboard/admin/users/${userId}`,
            {
                method: DELETE
            }
        )

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            message.textContent = getErrorMessage(data)
            return
        }

        message.textContent = "Deleted User Succesfully"

        await loadUser();
    } catch (error) {
        console.log(error);
        message.textContent = "Can't connect to server."
    }
}

loadUser();

let currentPage = 1;
const limit = 10;
let totalPages = 1;

let currentSearch = "";
let currentMinPrice = "";
let currentMaxPrice = "";
let currentSort = "";

async function loadCourse(page=1) {
    try {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);

        if (currentSearch) {
            params.append("search", currentSearch);
        }

        if (currentMinPrice) {
            params.append("min_price", currentMinPrice);
        }

        if (currentMaxPrice) {
            params.append("max_price", currentMaxPrice);
        }

        if (currentSort) {
            params.append("sort", currentSort);
        }

        const response = await apiFetch(`courses?${params.toString()}`)

        const data = await response.json()

        if (!response.ok) {
            message.textContent = getErrorMessage(data);
            return;
        }

        courseList.innerHTML = ""
        
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
    }
}

loadCourse();

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

searchButton.addEventListener("click", () => {
    currentSearch = searchInput.value.trim();
    currentMinPrice = minPriceInput.value;
    currentMaxPrice = maxPriceInput.value;
    currentSort = sortPrice.value;
    currentPage = 1;
    loadCourses(currentPage);
});

async function addDeleteCourseEvent() {
    const buttons = document.querySelector("#delete-course")

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const courseId = Number(button.dataset.id)
        
            deleteCourse(courseId)
        })  
    })
}

async function deleteCourse(courseId) {
    try {
        const response = await apiFetch(`/courses/${courseId}`,
            {
                method: DELETE
            }
        )

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            message.textContent = getErrorMessage(data)
            return
        }

        message.textContent = "Deleted Course Succesfully"

        await loadCourse();
    } catch (error) {
        console.log(error);
        message.textContent = "Can't connect to server."
    }
}

