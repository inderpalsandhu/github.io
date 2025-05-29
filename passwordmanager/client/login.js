document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex"; // Show loading

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  try {
    const res = await fetch("https://passwordmanager-789b.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "vault.html";
    } else {
      msg.textContent = data.message || "Login failed.";
    }
  } catch (err) {
    msg.textContent = "Server is not responding.";
  } finally {
    overlay.style.display = "none"; // Hide loading
  }
});
