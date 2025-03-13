"use strict";

/**
 * Dynamically load the header from the header.html into the current page
 */

export function LoadHeader() {
    console.log("[INFO] Loading Header()");

    return fetch("./views/components/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            updateActiveNewLink();
            CheckLogin();
        })
        .catch(error =>{
            console.error("[ERROR] Unable to load header")
        });
}

export function updateActiveNewLink(){
    console.log("[INFO] Updating active nav link...");

    const currentPath = location.hash.slice(1);
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach((link) => {

        const linkPath = link.getAttribute("href").replace("#", "");
        if(currentPath === linkPath) {
            link.classList.add("active");
        }else{
            link.classList.remove("active");
        }
    });
}

function handleLogout(event){
    event.preventDefault();

    sessionStorage.removeItem("user");
    console.log("[INFO] User logged out. Updating UI...");

    LoadHeader().then(() => {
        CheckLogin();
        location.hash = "/";
    });
}

export function CheckLogin(){
    console.log("[INFO] Checking user login status...");
    const loginNav = document.getElementById("login");
    if (!loginNav) {
        console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().");
        return;
    }

    const userSession = sessionStorage.getItem("user")
    if (userSession) {
        loginNav.innerHTML = `<i class="fas fas-sign-out-alt"></i> Logout`;
        loginNav.href = "#";
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", handleLogout);

    }else{
        loginNav.innerHTML = `<i class="fas fas-sign-in-alt"></i> Login`;
        loginNav.removeEventListener("click", handleLogout);
        loginNav.addEventListener("click", () => location.hash = "/login");
    }
}