const form = document.querySelector(".register-form");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmpassword = document.querySelector("#confirm-password");

const error = document.querySelector(".error");
const success = document.querySelector(".success");

const submitButton = document.querySelector("#submit-register");


async function registerUser() {

    error.textContent = "";
    success.textContent = "";

    if (password.value !== confirmpassword.value) {
        error.textContent = "Passwords do not match";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Registering...";

    try {

        const response = await fetch("/auth/register",
            {
                method: "POST",
                body: JSON.stringify({
                    username: username.value.trim(),
                    email: email.value.trim(),
                    password: password.value
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            error.textContent = getErrorMessage(data);
            return;
        }

        success.textContent = "Register successful!";

    } catch (err) {
        error.textContent = "Cannot connect to server";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Register";
    }
}


form.addEventListener("submit", async event => {

    event.preventDefault();
    
    await registerUser();

});