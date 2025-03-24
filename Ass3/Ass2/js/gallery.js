export function fetchGallery() {
    fetch('./data/gallery.json')
        .then(response => {
            if (!response.ok) throw new Error("Gallery JSON not found");
            return response.json();
        })
        .then(images => displayGallery(images))
        .catch(error => {
            console.error("Failed to fetch gallery images:", error);
            const gallerySection = document.getElementById("gallerySection");
            if (gallerySection) {
                gallerySection.innerHTML = `<div class="alert alert-danger">Unable to load gallery at the moment.</div>`;
            }
        });
}

function displayGallery(images) {
    const gallerySection = document.getElementById("gallerySection");
    if (!gallerySection) return;

    gallerySection.innerHTML = ""; // clear previous images

    images.forEach(image => {
        const imageCol = document.createElement("div");
        imageCol.className = "col-md-4 mb-4";
        imageCol.innerHTML = `
            <img src="${image.url}" alt="${image.caption}" class="img-fluid rounded gallery-image" 
                style="max-width: 80%; height: auto;" 
                data-bs-toggle="modal" data-bs-target="#lightboxModal" data-image="${image.url}">
        `;
        gallerySection.appendChild(imageCol);
    });

    document.querySelectorAll('.gallery-image').forEach(img => {
        img.addEventListener('click', (e) => {
            const lightboxImage = document.getElementById("lightboxImage");
            lightboxImage.src = e.target.getAttribute('data-image');
        });
    });
}
