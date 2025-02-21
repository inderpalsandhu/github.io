"use strict";

// Fetch and display volunteer opportunities dynamically
async function fetchOpportunities() {
    try {
        console.log("[INFO] Fetching opportunities data...");

        const response = await fetch('./data/opportunities.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const opportunities = await response.json();
        displayOpportunities(opportunities);
    } catch (error) {
        console.error("[ERROR] Failed to fetch opportunities:", error);
        displayOpportunitiesError("Unable to load volunteer opportunities at the moment. Please try again later.");
    }
}

// Display opportunities dynamically on the page
function displayOpportunities(opportunities) {
    const opportunitiesList = document.getElementById("opportunitiesList");
    const opportunityCategoryFilter = document.getElementById("opportunityCategoryFilter");

    if (!opportunitiesList || !opportunityCategoryFilter) {
        console.error("[ERROR] Required HTML elements not found.");
        return;
    }

    function filterAndDisplay(category) {
        opportunitiesList.innerHTML = "";
        const filteredOpportunities = category === "all" ? opportunities : opportunities.filter(opportunity => opportunity.category === category);

        filteredOpportunities.forEach(opportunity => {
            const card = document.createElement("div");
            card.className = "col-md-6 mb-4";
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${opportunity.title}</h5>
                        <p class="card-text">${opportunity.description}</p>
                        <p><strong>Date:</strong> ${opportunity.date}</p>
                        <p><strong>Category:</strong> ${opportunity.category}</p>
                    </div>
                </div>`;
            opportunitiesList.appendChild(card);
        });
    }

    // Initial display of all opportunities
    filterAndDisplay("all");

    // Add event listener for filtering by category
    opportunityCategoryFilter.addEventListener("change", (event) => {
        filterAndDisplay(event.target.value);
    });
}

// Display error message if opportunities fail to load
function displayOpportunitiesError(message) {
    const opportunitiesList = document.getElementById("opportunitiesList");
    if (opportunitiesList) {
        opportunitiesList.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    }
}

// Initialize the opportunities functionality when the DOM is loaded
if (document.title === "Volunteer Opportunities | Volunteer Connect") {
    document.addEventListener("DOMContentLoaded", fetchOpportunities);
}

