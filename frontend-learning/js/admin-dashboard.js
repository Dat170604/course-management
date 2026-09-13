const logout = document.querySelector("#logout")
const message = document.querySelector("#message")
const students = document.querySelector("#student-list")
const teachers = document.querySelector("#teacher-list")
const courseList = document.querySelector("#course-list")

logout.addEventListener("click", Logout)

const user = document.querySelector(".user")

async function loadUser() {
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
            <p>${user.role}`

            teachers.appendChild(card)
        })
    } catch (err) {
        console.log(err)
        message.textContent = "Cannot connect to server."
    }
}

loadUser();

async function loadCourse() {
    try {
        const response = await apiFetch("/dashboard/admin/courses")

        const data = await response.json()

        if (!response.ok) {
            message.textContent = getErrorMessage(data);
            return;
        }

        courseList.innerHTML = ""
        
        data.forEach(course => {
            const card = document.createElement("div");
            card.classList.add("course-card");
            card.innerHTML = `
            <p>${course.title}</p>
            <p>${course.description}</p>
            <p>${course.price}
            `;

            courseList.appendChild(card)
        })

    } catch (err) {
        console.log(err)
        message.textContent = "Cannot connect to server."
    }
}

loadCourse();