/**
 * Main TypeScript file for Volunteer Connect
 * Author: Tadbhav Marken, Inderpal
 * Date: 2025-01-22
 * Student id- 100930926, 100922796
 */

"use strict";

const routes: Record<string, string> = {
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
};

// IIFE - Immediately Invoked Function Expression to avoid polluting global scope
(function () {
    /**
     * Adds a search bar dynamically to the navbar.
     */
    function addSearchBar(): void {
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
    function handleSearch(): void {
        document.addEventListener("DOMContentLoaded", () => {
            const searchForm = document.getElementById('searchForm') as HTMLFormElement | null;
            if (searchForm) {
                searchForm.addEventListener('submit', (event: Event) => {
                    event.preventDefault();
                    const query = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
                    searchNews(query);
                });
            } else {
                console.error("[ERROR] Search form not found in the DOM.");
            }
        });
    }

    /**
     * Filters and displays news articles based on the search query.
     * @param query - Search query
     */
    function searchNews(query: string): void {
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
     * @param articles - An array of news articles from GNews
     */
    function displayNews(articles: Array<{ image: string; title: string; description: string; url: string }>): void {
        const newsSection = document.getElementById("newsSection") as HTMLElement;
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
async function fetchEvents(): Promise<void> {
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
 * @param events - An array of event objects
 */
function displayEvents(events: Array<{ title: string; description: string; date: string; category: string }>): void {
    const eventsList = document.getElementById("eventsList") as HTMLElement;
    const categoryFilter = document.getElementById("categoryFilter") as HTMLSelectElement;

    function filterAndDisplay(category: string): void {
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
    categoryFilter.addEventListener("change", (event: Event) => {
        filterAndDisplay((event.target as HTMLSelectElement).value);
    });
}

export async function fetchNews(): Promise<void> {
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
        const section = document.getElementById("newsSection") as HTMLElement;
        if (section) {
            section.innerHTML = `<div class="alert alert-danger" role="alert">Unable to load news articles at the moment.</div>`;
        }
    }
}
function displayNews(articles: any) {
    throw new Error("Function not implemented.");
}

