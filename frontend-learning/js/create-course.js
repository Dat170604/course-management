const courseForm = document.querySelector(".course-form");

const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const priceInput = document.querySelector("#price");

const message = document.querySelector("#message");

const cancelButton = document.querySelector("#cancel-button");

async function createCourse(event) {

    event.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;
    const price = Number(priceInput.value);

    if (!title || !description || price < 0) {
        message.textContent = "Please enter valid information.";
        return;
    }

    const courseData = {title, description, price}
    try {
        const response = await apiFetch("/courses",
            {
                method: "POST",
                body: JSON.stringify(courseData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = gerErrorMessage(data);
            return
        }    

        message.textContent = "Course created successfully!";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch (err) {
        console.log(err);
        message.textContent = "Cannot connect to server."
    }
}

courseForm.addEventListener("submit", createCourse)

cancelButton.addEventListener("click", () => {

    window.location.href = "teacher-dashboard.html";

});