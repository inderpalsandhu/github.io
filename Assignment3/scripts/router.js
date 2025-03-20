
document.addEventListener("DOMContentLoaded", function () {
    function loadPage(page) {
        fetch(`views/pages/${page}`)
            .then(response => {
                if (!response.ok) throw new Error("Page not found");
                return response.text();
            })
            .then(html => {
                document.getElementById("app").innerHTML = html;
            })
            .catch(error => {
                console.error("Error loading page:", error);
                document.getElementById("app").innerHTML = "<h2>Page not found</h2>";
            });
    }

    function navigate(event) {
        if (event.target.tagName === "A" && event.target.getAttribute("href")) {
            event.preventDefault();
            const page = event.target.getAttribute("href").replace(".html", "");
            history.pushState({}, "", page);
            loadPage(`${page}.html`);
        }
    }

    document.body.addEventListener("click", navigate);

    window.addEventListener("popstate", function () {
        let page = location.pathname.split("/").pop(); // Extracts last part of the URL
        if (!page || page === "index") page = "home";
        loadPage(`${page}.html`);
    });

    let initialPage = location.pathname.split("/").pop();
    if (!initialPage || initialPage === "index") initialPage = "home";
    loadPage(`${initialPage}.html`);
});
