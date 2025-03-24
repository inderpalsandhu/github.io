export interface Image {
    url: string;
    caption: string;
}

export function fetchGallery(): void {
    fetch('./data/gallery.json')
        .then(response => {
            if (!response.ok) throw new Error("Gallery JSON not found");
            return response.json();
        })
        .then((images: Image[]) => displayGallery(images))
        .catch(error => {
            console.error("Failed to fetch gallery images:", error);
            const gallerySection = document.getElementById("gallerySection");
            if (gallerySection) {
                gallerySection.innerHTML = `<div class="alert alert-danger">Unable to load gallery at the moment.</div>`;
            }
        });
}

function displayGallery(images: Image[]): void {
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
            const target = e.target as HTMLImageElement;
            const lightboxImage = document.getElementById("lightboxImage") as HTMLImageElement;
            if (lightboxImage) {
                lightboxImage.src = target.getAttribute('data-image') || '';
            }
        });
    });
}