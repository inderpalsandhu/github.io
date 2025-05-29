document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex"; // Show spinner

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  try {
    const res = await fetch("https://passwordmanager-789b.onrender.com/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      msg.style.color = "green";
      msg.textContent = "Registered successfully! You can now login.";
    } else {
      msg.style.color = "red";
      msg.textContent = data.message || "Registration failed.";
    }
  } catch (err) {
    msg.style.color = "red";
    msg.textContent = "Could not connect to server.";
  } finally {
    overlay.style.display = "none"; // Hide spinner
  }
});


const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthMessage = document.getElementById("strengthMessage");

passwordInput.addEventListener("input", function () {
  const value = passwordInput.value;
  const strength = checkPasswordStrength(value);

  strengthBar.style.width = strength.percent;
  strengthBar.className = `progress-bar ${strength.barClass}`;
  strengthMessage.textContent = `Strength: ${strength.label}`;
  strengthMessage.style.color = strength.textColor;
});

function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return {
        label: "Weak",
        percent: "25%",
        barClass: "bg-danger",
        textColor: "red"
      };
    case 2:
      return {
        label: "Fair",
        percent: "50%",
        barClass: "bg-warning",
        textColor: "orange"
      };
    case 3:
      return {
        label: "Good",
        percent: "75%",
        barClass: "bg-info",
        textColor: "blue"
      };
    default:
      return {
        label: "Strong",
        percent: "100%",
        barClass: "bg-success",
        textColor: "green"
      };
  }
}
