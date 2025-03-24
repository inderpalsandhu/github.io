/**
 * Main JavaScript file for Volunteer Connect
 * Author: Tadbhav Marken,Inderpal
 * Date: 2025-01-22
 * Student id- 100930926,100922796
 */

"use strict";
import { LoadHeader } from "../scripts/header.js";
LoadHeader();




  
import { updateActiveNavLink } from "../scripts/header.js";

document.addEventListener("routeLoaded", () => {
    updateActiveNavLink();
});

document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/stats") {
        import("../js/stats.js");
    }
});


import { Router } from "../scripts/router.js";
const routes = {
    "/": "views/pages/home.html",
    "/about": "./views/pages/about.html",
    "/contact": "./views/pages/contact.html",
    "/events": "./views/pages/events.html",
    "/gallery": "./views/pages/gallery.html",
    "/login": "./views/pages/login.html", // Corrected path for login page
    "/news": "./views/pages/news.html",
    "/opportunities": "./views/pages/opportunities.html",
    "/privacy": "./views/pages/privacy.html",
    "/terms": "./views/pages/terms.html",
    "/plan-event": "views/pages/event-planning.html",
    "/stats": "views/pages/stats.html"


};
const router = new Router(routes);

import { fetchOpportunities } from "./opportunities.js";

document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/opportunities") {
        fetchOpportunities();
    }
});



import { fetchGallery } from './gallery.js';

document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/gallery") {
        fetchGallery();
    }
});


document.addEventListener("routeLoaded", (e) => {
    const path = e.detail;

    if (path === "/events") {
        fetchEvents(); // your custom logic
    } else if (path === "/news") {
        fetchNews(); // load news
    }
});

document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/opportunities") {
        fetchOpportunities();
    }
});




document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/events") {
        fetchEvents(); // load events when navigating to /events
    }
});


// IIFE - Immediately Invoked Function Expression to avoid polluting global scope
(function () {
    /**
     * Adds a search bar dynamically to the navbar.
     */
    function addSearchBar() {
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const searchForm = document.createElement('li');
            searchForm.classList.add('nav-item');
            searchForm.innerHTML = `
                <form class="d-flex" id="searchForm">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="searchInput">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            `;
            navbar.appendChild(searchForm);
        }
    }

    /**
     * Handles search functionality for news.
     */
    function handleSearch() {
        document.addEventListener("DOMContentLoaded", () => {
            const searchForm = document.getElementById('searchForm');
            if (searchForm) {
                searchForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const query = document.getElementById('searchInput').value.toLowerCase();
                    searchNews(query);
                });
            } else {
                console.error("[ERROR] Search form not found in the DOM.");
            }
        });
    }

    /**
     * Filters and displays news articles based on the search query.
     * @param {string} query - Search query
     */
    function searchNews(query) {
        const apiKey = "43ca5f7def32c41f22de076556105812";
        const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=ca&max=10&token=${apiKey}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayNews(data.articles);
            })
            .catch(error => console.error("[ERROR] Failed to search news:", error));
    }

    /**
     * Displays news articles dynamically on the News page.
     * @param {Array} articles - An array of news articles from GNews
     */
    function displayNews(articles) {
        const newsSection = document.getElementById("newsSection");
        newsSection.innerHTML = ""; // Clear previous results
        if (!articles || articles.length === 0) {
            newsSection.innerHTML = `<div class="alert alert-warning" role="alert">No news articles found.</div>`;
            return;
        }
        articles.forEach(article => {
            const card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${article.image}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description ? article.description.substring(0, 150) : 'No description available.'}</p>
                        <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                    </div>
                </div>`;
            newsSection.appendChild(card);
        });
    }

    // Add search bar and activate search handling
    document.addEventListener("DOMContentLoaded", () => {
        addSearchBar();
        handleSearch();
    });
})();


/**
 * Fetches events data from a JSON file and dynamically displays it on the Events page.
 */
async function fetchEvents() {
    try {
        const response = await fetch('./data/events.json');
        if (!response.ok) throw new Error("Failed to load events.json");

        const fileEvents = await response.json();
        const customEvents = JSON.parse(localStorage.getItem("plannedEvents") || "[]");

        const allEvents = [...fileEvents, ...customEvents];

        displayEvents(allEvents);
    } catch (error) {
        console.error("[ERROR] Could not load events:", error);
    }
}



/**
 * Displays the list of events dynamically on the Events page.
 * @param {Array} events - An array of event objects
 */
function displayEvents(events) {
    const eventsList = document.getElementById("eventsList");
    const categoryFilter = document.getElementById("categoryFilter");

    function filterAndDisplay(category) {
        eventsList.innerHTML = "";
        const filteredEvents = category === "all" ? events : events.filter(event => event.category === category);

        filteredEvents.forEach(event => {
            const card = document.createElement("div");
            card.className = "col-md-6 mb-4";
            card.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">${event.description}</p>
                            <p><strong>Date:</strong> ${event.date}</p>
                            <p><strong>Category:</strong> ${event.category}</p>
                        </div>
                    </div>`;
            eventsList.appendChild(card);
        });
    }

    // Initial display of all events
    filterAndDisplay("all");

    // Add filtering functionality
    categoryFilter.addEventListener("change", (event) => {
        filterAndDisplay(event.target.value);
    });
}

export async function fetchNews() {
    const apiKey = "43ca5f7def32c41f22de076556105812";
    const url = `https://gnews.io/api/v4/search?q=volunteering&lang=en&country=ca&max=10&token=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error("Failed to fetch news:", error);
        const section = document.getElementById("newsSection");
        if (section) {
            section.innerHTML = `<div class="alert alert-danger" role="alert">Unable to load news articles at the moment.</div>`;
        }
    }
}

function displayNews(articles) {
    const newsSection = document.getElementById("newsSection");
    newsSection.innerHTML = "";
    if (!articles.length) {
        newsSection.innerHTML = `<div class="alert alert-warning">No articles found.</div>`;
        return;
    }

    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card h-100">
                <img src="${article.image}" class="card-img-top" alt="${article.title}">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description ? article.description.substring(0, 150) : 'No description available.'}</p>
                    <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                </div>
            </div>
        `;
        newsSection.appendChild(card);
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
                window.location.href = "index.html"; // Redirect to homepage after logout
            });
        }
    }
}
// Update the navbar on page load based on session
document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = document.getElementById("searchInput").value.toLowerCase();
        searchNews(query);
      });
    }
  
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // your feedback form logic here...
      });
    }

  });
  
  document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/plan-event") {
        import('./plan-events.js');
    }
});

  
/**
 * Handles search functionality for events and news.
 */
function handleSearch() {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (document.title === "Upcoming Events") {
            searchEvents(query);
        } else if (document.title === "News | Volunteer Connect") {
            searchNews(query);
        }
    });
}

/**
 * Filters and displays events based on the search query.
 * @param {string} query - Search query
 */
function searchEvents(query) {
    fetch('./data/events.json')
        .then(response => response.json())
        .then(events => {
            const filteredEvents = events.filter(event =>
                event.title.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)
            );
            displayEvents(filteredEvents);
        })
        .catch(error => console.error("[ERROR] Failed to search events:", error));
}

// Handle feedback form submission using AJAX
document.addEventListener("DOMContentLoaded", () => {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simulate form submission by saving data in localStorage
            const feedbackData = {
                name,
                email,
                subject,
                message,
                submittedAt: new Date().toISOString()
            };

            let feedbackList = JSON.parse(localStorage.getItem('feedbacks')) || [];
            feedbackList.push(feedbackData);
            localStorage.setItem('feedbacks', JSON.stringify(feedbackList));

            // Show confirmation modal
            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();

            // Reset form fields
            feedbackForm.reset();
        });
    }
});

document.addEventListener("routeLoaded", (e) => {
    if (e.detail === "/login") {
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
          event.preventDefault();
          const username = document.getElementById('username').value.trim();
          const password = document.getElementById('password').value.trim();
          const loginError = document.getElementById('loginError');
  
          if (username === 'admin' && password === 'password') {
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('showWelcome', 'true');
            location.hash = "#/"; // SPA redirect to home
          } else {
            loginError.classList.remove('d-none');
          }
        });
      }
    }
  });
  

function setupLoginPage() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginError = document.getElementById('loginError');

        if (username === 'admin' && password === 'password') {
            sessionStorage.setItem('loggedInUser', username);
            sessionStorage.setItem('showWelcome', 'true');
            location.hash = "#/"; // redirect via hash for SPA
        } else {
            loginError.classList.remove('d-none');
        }
    });
}


