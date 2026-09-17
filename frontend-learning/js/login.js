import { apiFetch, handleResponse } from "./api.js";


const form = document.querySelector(".login-form");

const login = document.querySelector("#login-btn")


const email = document.querySelector("#email");
const password = document.querySelector("#password");

const error = document.querySelector(".error")
const success = document.querySelector(".success")


async function LoginUser() {
    try{
        
        error.textContent = "";
        success.textContent = "";
        
        login.disabled = true;
        login.textContent = "Logging in...";


        const response = await apiFetch("/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email: email.value.trim(),
                    password: password.value
                })
            },
        );

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        console.log(data);
        
        localStorage.setItem(
            "access_token",
            data.access_token
        );

        localStorage.setItem(
            "refresh_token",
            data.refresh_token
        );

        success.textContent = "Login successful!";
        setTimeout(() => {
            loadUser()
        }, 1000);
        
    }   catch (err) {
        error.textContent ="Cannot connect to server";
    }   finally {
        login.disabled = false;
        login.textContent = "Login";
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    await LoginUser();
});


function showRole(role) {
    if (role === "STUDENT") {
        window.location.href = "student-dashboard.html"
    } else if (role === "TEACHER") {
        window.location.href = "teacher-dashboard.html"
    } else if (role === "ADMIN") {
        window.location.href = "admin-dashboard.html"
    }
}

async function loadUser() {

    try {
        const response = await apiFetch("/auth/me");

        const data = await handleResponse(response);

        if (data === null) {
            return;
        }

        showRole(data.role, data.username);
    } catch (err){
        console.error(err);  
    }
}

