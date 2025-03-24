document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/stats.json")
      .then(res => res.json())
      .then(data => {
          renderStats(data);
      })
      .catch(err => {
          console.error("Error loading stats:", err);
          document.getElementById("statsContainer").innerHTML = "<p>Error loading statistics.</p>";
      });
});

function renderStats(data) {
  const container = document.getElementById("statsContainer");
  container.innerHTML = `
      <h2 class="text-center mb-4">Volunteer Connect Statistics</h2>
      <div><strong>Monthly Visitors:</strong> ${data.monthlyVisitors.join(", ")}</div>
      <div><strong>Donation Types:</strong> Monetary: $${data.donationTypes.monetary}, Material: $${data.donationTypes.material}, Time: $${data.donationTypes.time}</div>
      <div><strong>Volunteer Roles:</strong> ${Object.entries(data.volunteerTypes).map(([k,v]) => `${k}: ${v}`).join(", ")}</div>
      <div><strong>Participants:</strong> ${Object.entries(data.participantCounts).map(([k,v]) => `${k}: ${v}`).join(", ")}</div>
      <div><strong>Funds Raised:</strong> ${Object.entries(data.fundsRaised).map(([k,v]) => `${k}: $${v}`).join(", ")}</div>
  `;
}
