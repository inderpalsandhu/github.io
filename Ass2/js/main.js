/**
 * Main JavaScript file for Volunteer Connect
 * Author: Tadbhav Marken,Inderpal
 * Date: 2025-01-22
 * Student id- 100930926,100922796
 */

"use strict";


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


    /**
     * Filters and displays news articles based on the search query.
     * @param {string} query - Search query
     */
    function searchNews(query) {
        const apiKey = "17f9a5ff50241a6d7e45c526bd2a38e8";
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
        if (articles.length === 0) {
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
        console.log("[INFO] Fetching events data...");

        const response = await fetch('./data/events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error("[ERROR] Failed to fetch events:", error);
        displayError("Unable to load events. Please try again later.");
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

/**
 * Displays an error message to the user in case of AJAX failure.
 * @param {string} message - Error message to be displayed
 */
function displayError(message) {
           const eventsList = document.getElementById("eventsList");
           eventsList.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
        }

        // Initialize AJAX loading when on the Events page
        if (document.title === "Upcoming Events") {
            fetchEvents();
        }

        // Fetch and display news articles from GNews API
        document.addEventListener("DOMContentLoaded", () => {
            const apiKey = "43ca5f7def32c41f22de076556105812";
            const url = `https://gnews.io/api/v4/search?q=volunteering&lang=en&country=ca&max=10&token=${apiKey}`;

            async function fetchNews() {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    displayNews(data.articles);
                } catch (error) {
                    console.error("Failed to fetch news:", error);
                    document.getElementById("newsSection").innerHTML = `<div class="alert alert-danger" role="alert">Unable to load news articles at the moment.</div>`;
                }
            }

    function displayNews(articles) {
        const newsSection = document.getElementById("newsSection");
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

    fetchNews();
});
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
document.addEventListener("DOMContentLoaded", updateNavbar);
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
document.getElementById('feedbackForm').addEventListener('submit', function (event) {
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
    document.getElementById('feedbackForm').reset();

});
