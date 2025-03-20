
document.addEventListener("DOMContentLoaded", function () {
    function loadJSON(url, callback) {
        fetch(url)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error("Error loading JSON:", error));
    }

    function displayEvents(events) {
        const eventsContainer = document.getElementById("eventsContainer");
        if (!eventsContainer) return;
        eventsContainer.innerHTML = events.map(event => `
            <div class="event-card">
                <h3>${event.title}</h3>
                <p>${event.date} - ${event.location}</p>
                <p>${event.description}</p>
                <button class="sign-up-btn" data-id="${event.id}">Sign Up</button>
            </div>
        `).join("");

        document.querySelectorAll(".sign-up-btn").forEach(button => {
            button.addEventListener("click", function () {
                alert("Signed up for event!");
            });
        });
    }

    function displayOpportunities(opportunities) {
        const oppContainer = document.getElementById("opportunitiesContainer");
        if (!oppContainer) return;
        oppContainer.innerHTML = opportunities.map(opp => `
            <div class="opportunity-card">
                <h3>${opp.title}</h3>
                <p>${opp.category}</p>
                <p>${opp.description}</p>
                <button class="apply-btn" data-id="${opp.id}">Apply</button>
            </div>
        `).join("");

        document.querySelectorAll(".apply-btn").forEach(button => {
            button.addEventListener("click", function () {
                alert("Applied for opportunity!");
            });
        });
    }

    if (document.getElementById("eventsContainer")) {
        loadJSON("data/events.json", displayEvents);
    }

    if (document.getElementById("opportunitiesContainer")) {
        loadJSON("data/opportunities.json", displayOpportunities);
    }
});
