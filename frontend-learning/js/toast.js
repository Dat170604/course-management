const toastContainer = document.querySelector("#toast-container");


export function showToast(message, type = "success") {

    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.classList.add(`toast-${type}`);
    const icon =
        type === "success"
            ? "✓"
            : type === "error"
                ? "✕"
                : type === "warning"
                    ? "⚠"
                    : "ℹ";
    toast.textContent = `${icon} ${message}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}