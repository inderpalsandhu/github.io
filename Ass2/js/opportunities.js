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
        handleOpportunitySearch(opportunities);
        handleOpportunitySorting(opportunities);
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
            const isSignedUp = checkSignUpStatus(opportunity.title);
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${opportunity.title}</h5>
                        <p class="card-text">${opportunity.description}</p>
                        <p><strong>Date:</strong> ${opportunity.date}</p>
                        <p><strong>Category:</strong> ${opportunity.category}</p>
                        <button class="btn btn-${isSignedUp ? 'success' : 'primary'} w-100 signup-btn" data-title="${opportunity.title}" ${isSignedUp ? 'disabled' : ''}>
                            ${isSignedUp ? 'Signed Up' : 'Sign Up'}
                        </button>
                    </div>
                </div>`;
            opportunitiesList.appendChild(card);
        });

        // Add event listeners to all sign-up buttons
        document.querySelectorAll('.signup-btn').forEach(button => {
            button.addEventListener('click', handleSignUp);
        });
    }

    // Initial display of all opportunities
    filterAndDisplay("all");

    // Add event listener for filtering by category
    opportunityCategoryFilter.addEventListener("change", (event) => {
        filterAndDisplay(event.target.value);
    });
}

function checkUserLoginStatus() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    return !!loggedInUser;
}

// Handle sign-up functionality
function handleSignUp(event) {

    if (!checkUserLoginStatus()) {
        alert("Please log in to sign up for volunteer opportunities!");
        window.location.href = "login.html";
        return;
    }


    const button = event.target;
    const opportunityTitle = button.getAttribute('data-title');
    let signedUpOpportunities = JSON.parse(localStorage.getItem('signedUpOpportunities')) || [];

    // if (!signedUpOpportunities.includes(opportunityTitle)) {
    //     signedUpOpportunities.push(opportunityTitle);
    //     localStorage.setItem('signedUpOpportunities', JSON.stringify(signedUpOpportunities));
    //     button.textContent = 'Signed Up';
    //     button.classList.remove('btn-primary');
    //     button.classList.add('btn-success');
    //     button.disabled = true;
    //     alert(`You have successfully signed up for ${opportunityTitle}!`);
    // }/

    showSignupForm(opportunityTitle);
}


function showSignupForm(opportunityTitle) {
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    const modalHTML = `
        <div class="modal fade" id="signupFormModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Sign Up for ${opportunityTitle}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="volunteerSignupForm">
                            <div class="mb-3">
                                <label for="volunteerName" class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="volunteerName" required>
                            </div>
                            <div class="mb-3">
                                <label for="volunteerEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="volunteerEmail" required>
                            </div>
                            <div class="mb-3">
                                <label for="preferredRole" class="form-label">Preferred Role</label>
                                <select class="form-control" id="preferredRole" required>
                                    <option value="">Select a role...</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="helper">Helper</option>
                                    <option value="supervisor">Supervisor</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="submitVolunteerSignup('${opportunityTitle}')">Submit</button>
                    </div>
                </div>
            </div>
        </div>`;

    // Add modal to document
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('signupFormModal'));
    modal.show();
}

// Add new function to handle form submission
function submitVolunteerSignup(opportunityTitle) {
    const name = document.getElementById('volunteerName').value;
    const email = document.getElementById('volunteerEmail').value;
    const role = document.getElementById('preferredRole').value;

    if (!name || !email || !role) {
        alert('Please fill in all required fields!');
        return;
    }

    // Save signup data with additional details
    let signedUpOpportunities = JSON.parse(localStorage.getItem('signedUpOpportunities')) || [];
    const signupData = {
        title: opportunityTitle,
        name: name,
        email: email,
        role: role,
        username: sessionStorage.getItem('loggedInUser'),
        date: new Date().toISOString()
    };

    signedUpOpportunities.push(signupData);
    localStorage.setItem('signedUpOpportunities', JSON.stringify(signedUpOpportunities));

    // Update UI
    const button = document.querySelector(`.signup-btn[data-title="${opportunityTitle}"]`);
    button.textContent = 'Signed Up';
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    button.disabled = true;

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('signupFormModal'));
    modal.hide();

    // Remove modal from DOM after hiding
    modal._element.addEventListener('hidden.bs.modal', function () {
        this.remove();
    });

    alert(`Thank you for signing up for ${opportunityTitle}!\nWe'll contact you at ${email} with more details.`);
}



// Check if the user has already signed up for an opportunity
function checkSignUpStatus(title) {
    const signedUpOpportunities = JSON.parse(localStorage.getItem('signedUpOpportunities')) || [];
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    return signedUpOpportunities.some(signup =>
        signup.title === title && signup.username === loggedInUser
    );
}


// Add search functionality for opportunities
function handleOpportunitySearch(opportunities) {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = document.getElementById('searchInput').value.toLowerCase();
        searchOpportunities(query, opportunities);
    });
}

// Add sorting functionality for opportunities
function handleOpportunitySorting(opportunities) {
    const sortSelect = document.getElementById('sortOpportunities');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', (event) => {
        const sortedOpportunities = [...opportunities];
        const sortBy = event.target.value;

        switch (sortBy) {
            case 'date-newest':
                sortedOpportunities.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-oldest':
                sortedOpportunities.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'category-az':
                sortedOpportunities.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case 'category-za':
                sortedOpportunities.sort((a, b) => b.category.localeCompare(a.category));
                break;
        }
        displayOpportunities(sortedOpportunities);
    });
}

// Filter opportunities based on search query
function searchOpportunities(query, opportunities) {
    const opportunitiesList = document.getElementById("opportunitiesList");
    opportunitiesList.innerHTML = "";

    const filteredOpportunities = opportunities.filter(opportunity =>
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.description.toLowerCase().includes(query) ||
        opportunity.category.toLowerCase().includes(query)
    );

    if (filteredOpportunities.length === 0) {
        opportunitiesList.innerHTML = `<div class="alert alert-warning" role="alert">No opportunities found matching your search.</div>`;
    } else {
        filteredOpportunities.forEach(opportunity => {
            const isSignedUp = checkSignUpStatus(opportunity.title);
            const card = document.createElement("div");
            card.className = "col-md-6 mb-4";
            card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${opportunity.title}</h5>
                        <p class="card-text">${opportunity.description}</p>
                        <p><strong>Date:</strong> ${opportunity.date}</p>
                        <p><strong>Category:</strong> ${opportunity.category}</p>
                        <button class="btn btn-${isSignedUp ? 'success' : 'primary'} w-100 signup-btn" 
                            data-title="${opportunity.title}" ${isSignedUp ? 'disabled' : ''}>
                            ${isSignedUp ? 'Signed Up' : 'Sign Up'}
                        </button>
                    </div>
                </div>`;
            opportunitiesList.appendChild(card);
        });
        document.querySelectorAll('.signup-btn').forEach(button => {
            button.addEventListener('click', handleSignUp);
        });
    }
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
