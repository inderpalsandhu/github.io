function showToast(message, type = "success") {
  const toastEl = document.getElementById("actionToast");
  const toastBody = document.getElementById("toastMessage");

  toastBody.textContent = message;

  toastEl.classList.remove("bg-success", "bg-danger", "bg-warning");
  toastEl.classList.add(`bg-${type}`);

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}



const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const list = document.getElementById("vaultList");

async function loadVault() {
  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex"; // Show loader

  try {
    const res = await fetch("https://passwordmanager-789b.onrender.com/api/vault", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("vault-entry");
      li.innerHTML = `

        <div class="card shadow-sm h-100">
          <div class="card-body">
        <div><strong>Site:</strong> <span class="site">${item.site}</span></div>
        <div><strong>Username:</strong> <span class="username">${item.username}</span></div>
        <div><strong>Password:</strong> <span class="password">${item.password}</span></div>
        <div class="mt-2">
          <button class="btn btn-danger btn-sm delete-btn" data-id="${item._id}"><i class="bi bi-trash"></i> Delete</button>
          <button class="btn btn-secondary btn-sm edit-btn" data-id="${item._id}"><i class="bi bi-pencil"></i> Edit</button>
        </div>
        </div>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to fetch vault:", err);
    showToast("⚠️ Failed to load vault.", "danger");
  } finally {
    overlay.style.display = "none"; // Hide loader
  }
}


document.getElementById("addForm").addEventListener("submit", async e => {
  e.preventDefault();
  const site = document.getElementById("site").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await fetch("https://passwordmanager-789b.onrender.com/api/vault", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ site, username, password })
  });

  e.target.reset();
  showToast("Entry added successfully ✅", "success");

  loadVault();
});

async function deleteEntry(id) {
  await fetch(`https://passwordmanager-789b.onrender.com/api/vault${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadVault();
}

loadVault();

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});



list.addEventListener("click", async function (e) {
  const id = e.target.getAttribute("data-id");

  // DELETE
  if (e.target.classList.contains("delete-btn")) {
    await fetch(`https://passwordmanager-789b.onrender.com/api/vault/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    showToast("Entry deleted ✅", "danger");

    loadVault();
  }

  // EDIT
  if (e.target.classList.contains("edit-btn")) {
    const entry = e.target.closest(".vault-entry");

    const site = entry.querySelector(".site").textContent;
    const username = entry.querySelector(".username").textContent;
    const password = entry.querySelector(".password").textContent;

    entry.innerHTML = `
  <input class="form-control mb-2" value="${site}" id="editSite-${id}" />
  <input class="form-control mb-2" value="${username}" id="editUsername-${id}" />
  <input class="form-control mb-2" value="${password}" id="editPassword-${id}" />

  <div class="progress mb-2" style="height: 8px;">
    <div id="editStrengthBar-${id}" class="progress-bar" role="progressbar" style="width: 0%"></div>
  </div>
  <small id="editStrengthMessage-${id}" class="text-muted d-block mb-2"></small>

  <button class="btn btn-primary btn-sm save-edit" data-id="${id}">Save</button>
`;
    const editPassInput = document.getElementById(`editPassword-${id}`);
    const editStrengthBar = document.getElementById(`editStrengthBar-${id}`);
    const editStrengthMessage = document.getElementById(`editStrengthMessage-${id}`);

    editPassInput.addEventListener("input", function () {
      const val = editPassInput.value;
      const strength = checkPasswordStrength(val);
      editStrengthBar.style.width = strength.percent;
      editStrengthBar.className = `progress-bar ${strength.barClass}`;
      editStrengthMessage.textContent = `Strength: ${strength.label}`;
      editStrengthMessage.style.color = strength.textColor;
    });

  }

  // SAVE
  if (e.target.classList.contains("save-edit")) {
    const newSite = document.getElementById(`editSite-${id}`).value;
    const newUsername = document.getElementById(`editUsername-${id}`).value;
    const newPassword = document.getElementById(`editPassword-${id}`).value;

    const res = await fetch(`https://passwordmanager-789b.onrender.com/api/vault/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        site: newSite,
        username: newUsername,
        password: newPassword
      })
    });

    if (res.ok) {
      const entry = e.target.closest(".vault-entry");
      showToast("Entry updated ✅", "success");

      setTimeout(() => loadVault(), 1000);
    } else {
      showToast("❌ Failed to update entry.", "danger");

    }
  }
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
function getUsernameFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username;
  } catch (err) {
    return null;
  }
}

const username = getUsernameFromToken(token);
const welcome = document.getElementById("welcomeUser");
if (welcome && username) {
  welcome.textContent = `Welcome, ${username}!`;
}

document.getElementById("downloadPdfBtn").addEventListener("click", async function () {
  const res = await fetch("https://passwordmanager-789b.onrender.com/api/vault", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.text("Password Vault Backup", 20, 20);
  doc.setFont("helvetica", "normal");

  let y = 30;
  data.forEach((item, index) => {
    doc.text(`Site: ${item.site}`, 20, y);
    doc.text(`Username: ${item.username}`, 20, y + 7);
    doc.text(`Password: ${item.password}`, 20, y + 14);
    y += 25;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  doc.save("password-vault.pdf");
});


