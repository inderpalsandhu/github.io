export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener("hashchange", () => this.loadRoute());
        document.addEventListener("DOMContentLoaded", () => this.loadRoute());
    }

    async loadRoute() {
        const path = location.hash.slice(1) || "/";
        const contentDiv = document.querySelector("main");

        // ✅ Clear existing content to prevent stacking
        contentDiv.innerHTML = "";

        if (this.routes[path]) {
            try {
                const response = await fetch(this.routes[path]);
                if (!response.ok) {
                    throw new Error("Page not found");
                }
                const html = await response.text();
                contentDiv.innerHTML = html;

                // ✅ Optional: Trigger custom event for additional logic per page
                document.dispatchEvent(new CustomEvent("routeLoaded", { detail: path }));

            } catch (error) {
                contentDiv.innerHTML = "<h1>Page Not Found</h1>";
                console.error("Failed to load route:", error);
            }
        } else {
            contentDiv.innerHTML = "<h1>Page Not Found</h1>";
        }
    }
}
