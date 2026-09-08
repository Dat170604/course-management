const form = document.querySelector(".login-form");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

form.addEventListener("submit", event => {

    event.preventDefault();

    if (email.value === "") {
        console.log("Email is required");
        return;
    }

    if (password.value === "") {
        console.log("Password is required");
        return;
    }

    console.log(email.value);
    console.log(password.value);
    console.log("Login valid");
});

