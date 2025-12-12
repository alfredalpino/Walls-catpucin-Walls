// Get all image files dynamically
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
let allImages = [];
let filteredImages = [];
let currentImageIndex = 0;

// DOM Elements
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalFilename = document.getElementById('modalFilename');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalDownload = document.getElementById('modalDownload');
const imageCount = document.getElementById('imageCount');

// Fetch all images from the directory
async function loadImages() {
    try {
        // First, try to load from images.json
        const jsonResponse = await fetch('./images.json');
        if (jsonResponse.ok) {
            allImages = await jsonResponse.json();
        } else {
            throw new Error('images.json not found');
        }
    } catch (error) {
        console.log('Trying alternative method to load images...');
        try {
            // Try GitHub API if on GitHub Pages
            allImages = await getImagesFromGitHubAPI();
        } catch (apiError) {
            console.error('Error loading images:', apiError);
            // Last resort: try directory listing
            try {
                const response = await fetch('./');
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = Array.from(doc.querySelectorAll('a'));
                
                allImages = links
                    .map(link => link.href)
                    .filter(href => {
                        const lower = href.toLowerCase();
                        return imageExtensions.some(ext => lower.endsWith(ext));
                    })
                    .map(href => {
                        const url = new URL(href, window.location.href);
                        return url.pathname.split('/').pop();
                    })
                    .filter(Boolean)
                    .filter(name => name && name !== 'README.md')
                    .sort();
            } catch (listError) {
                console.error('All methods failed:', listError);
                allImages = [];
            }
        }
    }
    
    filteredImages = [...allImages];
    imageCount.textContent = `${allImages.length} wallpapers`;
    renderGallery();
    loading.classList.add('hidden');
}

// Fallback: Get images from GitHub API
async function getImagesFromGitHubAPI() {
    if (window.location.hostname.includes('github.io')) {
        try {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            // GitHub Pages URL structure: /username/repo-name/
            if (pathParts.length >= 2) {
                const owner = pathParts[0];
                const repo = pathParts[1];
                const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
                const response = await fetch(apiUrl);
                
                if (!response.ok) {
                    throw new Error('GitHub API request failed');
                }
                
                const data = await response.json();
                
                if (data.tree) {
                    return data.tree
                        .filter(item => {
                            const lowerPath = item.path.toLowerCase();
                            return imageExtensions.some(ext => lowerPath.endsWith(ext)) &&
                                   item.path.startsWith('walls-catppuccin-mocha/') &&
                                   !item.path.substring('walls-catppuccin-mocha/'.length).includes('/'); // Only files directly in the folder
                        })
                        .map(item => item.path.substring('walls-catppuccin-mocha/'.length)) // Remove folder prefix
                        .sort();
                }
            }
        } catch (error) {
            console.error('GitHub API error:', error);
            throw error;
        }
    }
    throw new Error('Not on GitHub Pages');
}

// Create image list from directory listing (fallback method)
function generateImageList() {
    // This will be populated by scanning actual files
    // For now, return empty and images will be loaded on demand
    return [];
}

// Render gallery with lazy loading
function renderGallery() {
    gallery.innerHTML = '';
    
    filteredImages.forEach((imageName, index) => {
        const item = createGalleryItem(imageName, index);
        gallery.appendChild(item);
    });
    
    // Initialize intersection observer for lazy loading
    initLazyLoading();
}

// Create a gallery item
function createGalleryItem(imageName, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = index;
    item.tabIndex = 0;
    
    const img = document.createElement('img');
    // Use relative path - works on both local and GitHub Pages
    img.src = `./walls-catppuccin-mocha/${imageName}`;
    img.alt = imageName.replace(/\.[^/.]+$/, '');
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Add error handling
    img.onerror = function() {
        console.error('Failed to load image:', img.src);
    };
    
    const info = document.createElement('div');
    info.className = 'gallery-item-info';
    
    const name = document.createElement('div');
    name.className = 'gallery-item-name';
    name.textContent = imageName;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn-small';
    downloadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download
    `;
    
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadImage(`./walls-catppuccin-mocha/${imageName}`);
    });
    
    info.appendChild(name);
    info.appendChild(downloadBtn);
    item.appendChild(img);
    item.appendChild(info);
    
    item.addEventListener('click', () => openModal(index));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(index);
        }
    });
    
    return item;
}

// Initialize lazy loading with Intersection Observer
function initLazyLoading() {
    const images = gallery.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Open modal with fullscreen viewer
function openModal(index) {
    currentImageIndex = index;
    const imageName = filteredImages[index];
    const imagePath = `./walls-catppuccin-mocha/${imageName}`;
    modalImage.src = imagePath;
    modalFilename.textContent = imageName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add error handling
    modalImage.onerror = function() {
        console.error('Failed to load image in modal:', imagePath);
    };
    
    // Update download button
    modalDownload.onclick = () => downloadImage(imagePath);
    
    // Update navigation buttons
    modalPrev.style.display = filteredImages.length > 1 ? 'flex' : 'none';
    modalNext.style.display = filteredImages.length > 1 ? 'flex' : 'none';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalImage.src = '';
}

// Navigate to previous image
function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
    } else {
        currentImageIndex = filteredImages.length - 1;
    }
    openModal(currentImageIndex);
}

// Navigate to next image
function nextImage() {
    if (currentImageIndex < filteredImages.length - 1) {
        currentImageIndex++;
    } else {
        currentImageIndex = 0;
    }
    openModal(currentImageIndex);
}

// Download image
function downloadImage(imagePath) {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = imagePath.split('/').pop(); // Get just the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        filteredImages = [...allImages];
    } else {
        filteredImages = allImages.filter(imageName =>
            imageName.toLowerCase().includes(query)
        );
    }
    
    imageCount.textContent = `${filteredImages.length} wallpapers`;
    renderGallery();
}

// Event Listeners
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
modalPrev.addEventListener('click', prevImage);
modalNext.addEventListener('click', nextImage);

searchInput.addEventListener('input', handleSearch);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadImages();
});


// Export for debugging
window.galleryApp = {
    allImages,
    filteredImages,
    openModal,
    closeModal,
    downloadImage
};
