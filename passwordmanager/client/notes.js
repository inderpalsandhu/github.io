const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const notesList = document.getElementById("notesList");
const form = document.getElementById("noteForm");

const SECRET_KEY = "InderpalSecureNoteKey!"; // Change this if you'd like

function encrypt(text) {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

async function loadNotes() {
    const overlay = document.getElementById("loadingOverlay");
    overlay.style.display = "flex"; // Show loader

    try {
        const res = await fetch("https://passwordmanager-789b.onrender.com/api/notes", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const notes = await res.json();
        notesList.innerHTML = "";

        notes.forEach(note => {
            const div = document.createElement("div");
            div.className = "col-md-6 mb-3";
            div.innerHTML = `
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">${note.title}</h5>
            <p class="card-text">${decrypt(note.encryptedText)}</p>
            <button class="btn btn-sm btn-danger delete-note" data-id="${note._id}"> <i class="bi bi-trash"></i> Delete</button>
          </div>
        </div>
      `;
            notesList.appendChild(div);
        });
    } catch (err) {
        alert("Failed to load notes.");
    } finally {
        overlay.style.display = "none"; // Hide loader
    }
}

form.addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const text = document.getElementById("noteText").value;
    const encryptedText = encrypt(text);

    await fetch("https://passwordmanager-789b.onrender.com/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, encryptedText })
    });

    form.reset();
    loadNotes();
});

notesList.addEventListener("click", async e => {
    if (e.target.classList.contains("delete-note")) {
        const id = e.target.getAttribute("data-id");
        await fetch(`https://passwordmanager-789b.onrender.com/api/notes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        loadNotes();
    }
});

loadNotes();

document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

