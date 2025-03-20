
document.addEventListener("DOMContentLoaded", function () {
    fetch("views/components/header.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
        })
        .catch(error => console.error("Error loading header:", error));
});
