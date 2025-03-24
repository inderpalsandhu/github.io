interface EventData {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    category: string;
}

const form = document.querySelector<HTMLFormElement>("#yourFormId"); // Replace with your form's ID

if (form) {
    form.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const data: EventData = {
            title: (document.getElementById("eventName") as HTMLInputElement).value,
            date: (document.getElementById("eventDate") as HTMLInputElement).value,
            time: (document.getElementById("eventTime") as HTMLInputElement).value,
            location: (document.getElementById("eventLocation") as HTMLInputElement).value,
            description: (document.getElementById("eventDescription") as HTMLInputElement).value,
            category: "custom"
        };

        // Save to localStorage
        const events: EventData[] = JSON.parse(localStorage.getItem("plannedEvents") || "[]");
        events.push(data);
        localStorage.setItem("plannedEvents", JSON.stringify(events));

        form.reset();
        form.classList.remove("was-validated");

        // ✅ Redirect to Events page
        location.hash = "app2/views/pages/events.html";
    });
}
