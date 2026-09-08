const form = document.querySelector(".register-form");

const username = document.querySelector("#username")
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmpassword = document.querySelector("#confirm-password");

const error = document.querySelector(".error");


form.addEventListener("submit", event => {

    event.preventDefault();

    if (username.value.trim() === "") {
        error.textContent = "Username is required";
        return;
    }

    if (email.value.trim() === "") {
        error.textContent = "Email is required";
        return;
    }

    if (password.value.trim() === "") {
        error.textContent = "Password is required";
        return;
    }
    
    if (password.value !== confirmpassword.value) {
        error.textContent = "Passwords do not match";
        return;
    }

    error.classList.remove("error");
    error.classList.add("success");
    error.textContent = "Register successfully";

});