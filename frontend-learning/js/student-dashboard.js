import { enrollCourse, unenrollCourse, MyEnrollments } from "./enrollment.js";
import { Logout, handleResponse } from "./api.js";
import { getCourses } from "./course.js"


const courseList = document.querySelector("#course-list");
const message = document.querySelector("#message");
const logout = document.querySelector("#logout");
const my_courses = document.querySelector("#my-courses")

logout.addEventListener("click", Logout)

async function getMyEnrollments() {
    const response = await MyEnrollments()

    const data = await handleResponse(response);

    if (data === null) {
            return;
        }

    return data;
}

async function loadCourses() {
    message.textContent = "";
    try {
        const response = await getCourses();

        const data = await handleResponse(response);

        if (data === null) {
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

async function enrollCourses(courseId, button) {
    try {
        const response = await enrollCourse(courseId)

        const data = await handleResponse(response)

        if (data === null) {
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
        const response = await MyEnrollments();

        const data = await handleResponse(response)

        if (data === null) {
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
                unenrollCourses(courseId, button);
        });
    });
}

async function unenrollCourses(courseId, button) {
    try {
        button.disabled = true;
        button.textContent = "Removing...";

        const response = await unenrollCourse(courseId)

        const data = await handleResponse(response)

        if (data === null) {
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
