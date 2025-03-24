export function LoadHeader() {
    fetch("views/components/header.html")
        .then(response => response.text())
        .then(html => {
            const headerElement = document.querySelector("header");
            if (headerElement) {
                headerElement.innerHTML = html;

                // Attach event listeners to all nav links for SPA routing
                const navLinks = headerElement.querySelectorAll("a");
                navLinks.forEach(link => {
                    link.addEventListener("click", (e) => {
                        e.preventDefault();
                        const hash = link.getAttribute("href");
                        location.hash = hash; // trigger router
                    });
                });

                updateActiveNavLink(); // highlight active link
                updateNavbar();        // handle login/logout
            } else {
                console.error("Header element not found in index.html");
            }
        })
        .catch(error => console.error("Error loading header:", error));
}

export function updateActiveNavLink() {
    const links = document.querySelectorAll("header a");
    links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === location.hash || (location.hash === "" && link.getAttribute("href") === "#/")) {
            link.classList.add("active");
        }
    });
}

/**
 * Updates the navbar dynamically based on user session status.
 */

function updateNavbar() {
    const navbar = document.querySelector(".navbar-nav");
    if (navbar) {
        let loginNavItem = document.createElement("li");
        loginNavItem.classList.add("nav-item");
        const loggedInUser = sessionStorage.getItem("loggedInUser");

        if (loggedInUser) {
            loginNavItem.innerHTML = `<a class="nav-link" href="#" id="logoutButton"><i class="fa-solid fa-sign-out-alt"></i> Logout (${loggedInUser})</a>`;
        } else {
            loginNavItem.innerHTML = `<a class="nav-link" href="login.html"><i class="fa-solid fa-sign-in-alt"></i> Login</a>`;
        }

        navbar.appendChild(loginNavItem);

        // Add logout functionality
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", (e) => {
                e.preventDefault();
                sessionStorage.removeItem("loggedInUser");
                window.location.href = "Ass2/views/pages/login.html";
            });
        }
        
    }
}

