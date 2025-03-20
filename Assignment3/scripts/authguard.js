
document.addEventListener("DOMContentLoaded", function () {
    function checkAuth() {
        const user = localStorage.getItem("loggedInUser");
        if (!user) {
            window.location.href = "login.html"; // Redirect to login if not logged in
        }
    }

    if (window.location.pathname.includes("opportunities.html") || 
        window.location.pathname.includes("events.html") || 
        window.location.pathname.includes("contact.html")) {
        checkAuth();
    }
});
