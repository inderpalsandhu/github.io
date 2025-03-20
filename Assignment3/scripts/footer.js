
document.addEventListener("DOMContentLoaded", function () {
    fetch("views/components/footer.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
        })
        .catch(error => console.error("Error loading footer:", error));
});
