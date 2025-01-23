"use strict";

/**
 * Main JavaScript file for Volunteer Connect
 * Author: Your Name
 * Date: YYYY-MM-DD
 */

document.addEventListener("DOMContentLoaded", () => {
    /**
     * Highlights the active page in the navigation bar based on the current document title.
     */
    function highlightNavbar() {
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add("active");
            }
        });
    }

    /**
     * Sets up the Home Page with dynamic content and interactivity.
     */
    function setupHomePage() {
        console.log("Setting up Home Page...");

        // Redirect to Opportunities page when the "Get Involved" button is clicked
        const getInvolvedButton = document.querySelector(".btn-primary");
        if (getInvolvedButton) {
            getInvolvedButton.addEventListener("click", () => {
                window.location.href = "opportunities.html";
            });
        }
    }

    /**
     * Dynamically generates volunteer opportunities and handles Sign-Up modal functionality.
     */
    function setupOpportunitiesPage() {
        console.log("Setting up Opportunities Page...");

        const opportunities = [
            {
                title: "Beach Cleanup",
                description: "Help clean up the local beach and make it safe for everyone.",
                date: "March 10, 2025",
                time: "10:00 AM",
            },
            {
                title: "Food Drive",
                description: "Assist in organizing and distributing food to families in need.",
                date: "March 15, 2025",
                time: "1:00 PM",
            },
            {
                title: "Tree Planting",
                description: "Join us to plant trees and contribute to a greener environment.",
                date: "March 20, 2025",
                time: "9:00 AM",
            },
        ];

        const opportunitiesList = document.getElementById("opportunitiesList");
        opportunities.forEach((opportunity, index) => {
            const card = document.createElement("div");
            card.className = "col-md-4 mb-4";
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${opportunity.title}</h5>
                        <p class="card-text">${opportunity.description}</p>
                        <p><strong>Date:</strong> ${opportunity.date}</p>
                        <p><strong>Time:</strong> ${opportunity.time}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal" data-id="${index}">Sign Up</button>
                    </div>
                </div>`;
            opportunitiesList.appendChild(card);
        });

        // Handle Sign-Up Modal Submission
        const signUpForm = document.getElementById("signUpForm");
        const confirmationMessage = document.getElementById("confirmationMessage");

        signUpForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent default form submission
            confirmationMessage.style.display = "block";

            setTimeout(() => {
                confirmationMessage.style.display = "none";
                const modal = bootstrap.Modal.getInstance(document.getElementById("signUpModal"));
                modal.hide();
                signUpForm.reset();
            }, 2000);
        });
    }

    /**
     * Dynamically generates events and implements category filtering.
     */
    function setupEventsPage() {
        console.log("Setting up Events Page...");

        const events = [
            { title: "Charity Run", description: "Join our charity run to support local causes.", date: "March 12, 2025", category: "fundraiser" },
            { title: "Workshop", description: "Learn community-building strategies.", date: "March 18, 2025", category: "workshop" },
            { title: "Park Cleanup", description: "Help clean up the local park.", date: "March 25, 2025", category: "cleanup" },
        ];

        const eventsList = document.getElementById("eventsList");
        const categoryFilter = document.getElementById("categoryFilter");

        function displayEvents(category) {
            eventsList.innerHTML = ""; // Clear the current events list
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

        displayEvents("all"); // Display all events initially
        categoryFilter.addEventListener("change", (event) => {
            displayEvents(event.target.value);
        });
    }

    /**
     * Sets up the Contact Page with form validation and redirection.
     */
    function setupContactPage() {
        console.log("Setting up Contact Page...");

        const contactForm = document.getElementById("contactForm");
        const thankYouMessage = document.getElementById("thankYouMessage");

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Prevent default form submission

            // Validate form fields
            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const subject = document.getElementById("contactSubject").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            if (!name || !email || !subject || !message) {
                alert("Please fill out all fields before submitting.");
                return;
            }

            // Display Thank You Message
            thankYouMessage.style.display = "block";

            // Redirect to Home Page after 5 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 5000);
        });
    }

    // Highlight the active page in the navbar
    highlightNavbar();

    // Switch to page-specific functionality based on the document title
    switch (document.title) {
        case "Home":
            setupHomePage();
            break;
        case "Volunteer Opportunities":
            setupOpportunitiesPage();
            break;
        case "Upcoming Events":
            setupEventsPage();
            break;
        case "Contact Us":
            setupContactPage();
            break;
        case "About Us":
            console.log("Setting up About Page...");
            break;
        case "Privacy Policy":
        case "Terms of Service":
            console.log("No additional setup required for this page.");
            break;
        default:
            console.log("No specific setup required for this page.");
    }
});
