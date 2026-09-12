const courseList = document.querySelector("#course-list");
const message = document.querySelector("#message");
const logout = document.querySelector("#logout");
const my_courses = document.querySelector("#my-courses")

logout.addEventListener("click", Logout)

async function getMyEnrollments() {
    const response = await apiFetch("/enrollments/me");
    const data = await response.json();

    if (!response.ok) {
        return [];
    }

    return data;
}

async function loadCourses() {
    message.textContent = "";
    try {
        const response = await apiFetch("/courses?page=1&limit=10");

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            message.textContent = getErrorMessage(data);
            return;
        }

        const enrollments = await getMyEnrollments();
        const enrolledCourseIds = enrollments.map(enrollment => enrollment.course.id);

        courseList.innerHTML = "";

        data.courses.forEach(course => {
            const card = document.createElement("div");

            card.classList.add("course-card");

            const isEnrolled = enrolledCourseIds.includes(course.id);

            card.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p>Price: ${course.price}</p>
                <button
                    id="enroll-button"
                    data-id="${course.id}"
                    ${isEnrolled ? "disabled" : ""}>
                    ${isEnrolled ? "Enrolled" : "Enroll"}
                </button>
            `;

            courseList.appendChild(card);
        });

        addEnrollEvents();

    } catch (error) {
        console.error(error);
        message.textContent = "Cannot connect to server.";
    }
}

loadCourses();

function addEnrollEvents() {
    const buttons = document.querySelectorAll("#enroll-button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const courseId = Number(button.dataset.id);

            enrollCourse(courseId, button);
        });
    });
}

async function enrollCourse(courseId, button) {
    try {
        const response = await apiFetch(`/enrollments/${courseId}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }

            message.textContent = getErrorMessage(data);
            return;
        }

        button.textContent = "Enrolled";
        button.disabled = true;
        
        message.textContent = "Enrolled successfully!";


    } catch (error) {
        console.log(error);
        message.textContent = "Cannot connect to server.";
    }
}


async function loadMyCourses() {
    try {
        const response = await apiFetch("/enrollments/me");

        const data = await response.json();

        if (!response.ok) {
            message.textContent = getErrorMessage(data);
            return;
        }

        courseList.innerHTML = "";

        if (data.length === 0) {
            message.textContent = "You have not enrolled in any course.";
            return;
        }

        data.forEach(enrollment => {
            const course = enrollment.course;

            const card = document.createElement("div");

            card.classList.add("course-card");

            card.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p>Price: ${course.price}</p>
                <button 
                    id="unenroll-button"
                    data-id="${course.id}">
                    UnEnroll
                </button>
            `;

            courseList.appendChild(card);
        });

        addUnerollCourseEvent();

    } catch (error) {
        console.error(error);
        message.textContent = "Cannot connect to server.";
    }
}

my_courses.addEventListener("click", loadMyCourses)

async function addUnerollCourseEvent() {
    const buttons = document.querySelectorAll("#unenroll-button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const courseId = Number(button.dataset.id);
                unenrollCourse(courseId, button);
        });
    });
}

async function unenrollCourse(courseId, button) {
    try {
        button.disabled = true;
        button.textContent = "Removing...";

        const response = await apiFetch(
            `/enrollments/${courseId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = getErrorMessage(data);

            button.disabled = false;
            button.textContent = "Unenroll";

            return;
        }

        message.textContent = "Unenrolled successfully!";

        loadMyCourses();

    } catch (error) {
        console.error(error);
        message.textContent = "Cannot connect to server.";

        button.disabled = false;
        button.textContent = "Unenroll";
    }
}
