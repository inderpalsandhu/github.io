document.addEventListener("DOMContentLoaded", () => {
    async function fetchGallery() {
        try {
            const response = await fetch('./data/gallery.json');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const images = await response.json();
            displayGallery(images);
        } catch (error) {
            console.error("Failed to fetch gallery images:", error);
            document.getElementById("gallerySection").innerHTML = `<div class="alert alert-danger" role="alert">Unable to load gallery at the moment.</div>`;
        }
    }

    function displayGallery(images) {
        const gallerySection = document.getElementById("gallerySection");
        images.forEach(image => {
            const imageCol = document.createElement("div");
            imageCol.className = "col-md-4 mb-4";
            imageCol.innerHTML = `
                    <img src="${image.url}" alt="${image.caption}" class="img-fluid rounded gallery-image" data-bs-toggle="modal" data-bs-target="#lightboxModal" data-image="${image.url}">
                `;
            gallerySection.appendChild(imageCol);
        });

        // Lightbox functionality
        document.querySelectorAll('.gallery-image').forEach(img => {
            img.addEventListener('click', (e) => {
                const lightboxImage = document.getElementById("lightboxImage");
                lightboxImage.src = e.target.getAttribute('data-image');
            });
        });
    }

    fetchGallery();
});