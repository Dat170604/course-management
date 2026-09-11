const courseList = document.querySelector("#course-list")
const create_course = document.querySelector("#create-course")


logout.addEventListener("click", Logout)

async function loadTeacherCourses() {
    try{
        const response = await apiFetch("/courses/dashboard");
        const data = await response.json();

        if (!response.ok) {
            courseList.textContent = getErrorMessage(data);
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
            `;
            courseList.appendChild(card);
        })  
    } catch (err) {
        console.log(err);
        courseList.textContent = "Cannot connect to server.";
    }
}

loadTeacherCourses();

create_course.addEventListener("click", () => {
    window.location.href = "create-course.html";
});