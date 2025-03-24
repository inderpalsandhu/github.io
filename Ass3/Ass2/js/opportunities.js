"use strict";

export async function fetchOpportunities() {
    try {
        console.log("[INFO] Fetching opportunities data...");

        const response = await fetch('./data/opportunities.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const opportunities = await response.json();

        // Wait a bit to ensure DOM is loaded
        setTimeout(() => {
            displayOpportunities(opportunities);
            handleOpportunitySearch(opportunities);
            handleOpportunitySorting(opportunities);
        }, 0);
    } catch (error) {
        console.error("[ERROR] Failed to fetch opportunities:", error);
        const opportunitiesList = document.getElementById("opportunityList");
        if (opportunitiesList) {
            opportunitiesList.innerHTML = `<div class="alert alert-danger">Could not load data.</div>`;
        }
    }
}

function displayOpportunities(opportunities) {
    const opportunitiesList = document.getElementById("opportunityList");
    const opportunityFilter = document.getElementById("opportunityFilter");

    if (!opportunitiesList || !opportunityFilter) {
        console.error("[ERROR] Required HTML elements not found.");
        return;
    }

    function filterAndDisplay(category) {
        opportunitiesList.innerHTML = "";
        const filtered = category === "all"
            ? opportunities
            : opportunities.filter(o => o.category.toLowerCase() === category.toLowerCase());

            filtered.forEach(op => {
                const card = document.createElement("div");
                card.className = "col-md-6 mb-4";
            
                // Check if user already signed up
                const isSignedUp = checkSignUpStatus(op.title);
            
                card.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${op.title}</h5>
                            <p class="card-text">${op.description}</p>
                            <p><strong>Date:</strong> ${op.date}</p>
                            <p><strong>Category:</strong> ${op.category}</p>
                            <button class="btn btn-${isSignedUp ? 'success' : 'primary'} w-100 signup-btn" 
                                data-title="${op.title}" ${isSignedUp ? 'disabled' : ''}>
                                ${isSignedUp ? 'Signed Up' : 'Sign Up'}
                            </button>
                        </div>
                    </div>`;
                
                opportunitiesList.appendChild(card);
            });
            
            // 🧠 Add click event for each button after cards are created
            document.querySelectorAll(".signup-btn").forEach(btn =>
                btn.addEventListener("click", handleSignUp)
            );
    }            

    filterAndDisplay("all");

    opportunityFilter.addEventListener("change", (e) => {
        filterAndDisplay(e.target.value);
    });
}

function checkUserLoginStatus() {
    return !!sessionStorage.getItem("loggedInUser");
}

function checkSignUpStatus(title) {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const signups = JSON.parse(localStorage.getItem("signedUpOpportunities")) || [];
    return signups.some(signup => signup.title === title && signup.username === loggedInUser);
}


function handleSignUp(event) {
    if (!checkUserLoginStatus()) {
        alert("Please log in to sign up.");
        location.hash = "#/login";
        return;
    }

    const button = event.target;
    const title = button.getAttribute("data-title");

    const signupData = {
        title,
        username: sessionStorage.getItem("loggedInUser"),
        date: new Date().toISOString()
    };

    let signups = JSON.parse(localStorage.getItem("signedUpOpportunities")) || [];
    signups.push(signupData);
    localStorage.setItem("signedUpOpportunities", JSON.stringify(signups));

    button.textContent = "Signed Up";
    button.classList.remove("btn-primary");
    button.classList.add("btn-success");
    button.disabled = true;

    alert(`You’ve signed up for "${title}"`);
}


function handleOpportunitySearch(opportunities) {
    const form = document.getElementById("searchForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = document.getElementById("searchInput").value.toLowerCase();
        const filtered = opportunities.filter(o =>
            o.title.toLowerCase().includes(query) ||
            o.description.toLowerCase().includes(query)
        );
        displayOpportunities(filtered);
    });
}

function handleOpportunitySorting(opportunities) {
    const sortSelect = document.getElementById("sortOpportunities");
    if (!sortSelect) return;

    sortSelect.addEventListener("change", (e) => {
        const sorted = [...opportunities];
        const value = e.target.value;

        if (value === "date-newest") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (value === "date-oldest") sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (value === "category-az") sorted.sort((a, b) => a.category.localeCompare(b.category));
        if (value === "category-za") sorted.sort((a, b) => b.category.localeCompare(a.category));

        displayOpportunities(sorted);
    });
}
