export function createCourseCard(course) {
    const card = document.createElement("div");

    card.classList.add("course-card");

    card.innerHTML = `
        <h3>${course.title}</h3>
        <p>Description: ${course.description}</p>
        <p>Price: ${course.price}</p>
        <button
            class="view-button"
            data-id="${course.id}">
            View
        </button>
    `;

    return card;
}


export function createUserRow(user, index) {
    const row = document.createElement("div");

    row.classList.add("user-row");

    row.innerHTML = `
        <span>${index + 1}</span>
        <span>${user.username}</span>
        <span>${user.email}</span>
        <span>${user.role}</span>

        <button
            class="delete-user-button"
            data-id="${user.id}">
            Delete
        </button>
    `;

    return row;
}


export function renderCourses(container, courses) {
    container.innerHTML = "";

    courses.forEach(course => {
        const card = createCourseCard(course);

        container.appendChild(card);
    });
}


export function renderUsers(container, users) {
    container.innerHTML = "";

    users.forEach((user, index) => {
        const card = createUserRow(user, index);

        container.appendChild(card);
    });
}