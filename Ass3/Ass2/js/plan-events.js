form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const data = {
        title: document.getElementById("eventName").value,
        date: document.getElementById("eventDate").value,
        time: document.getElementById("eventTime").value,
        location: document.getElementById("eventLocation").value,
        description: document.getElementById("eventDescription").value,
        category: "custom"
    };

    // Save to localStorage
    const events = JSON.parse(localStorage.getItem("plannedEvents") || "[]");
    events.push(data);
    localStorage.setItem("plannedEvents", JSON.stringify(events));

    form.reset();
    form.classList.remove("was-validated");

    // ✅ Redirect to Events page
    location.hash = "app2/views/pages/events.html";
});
