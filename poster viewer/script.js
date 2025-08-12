class PosterGallery {
    constructor() {
        this.posters = [];
        this.currentIndex = 0;
        this.isModalOpen = false;
        
        this.init();
        this.bindEvents();
    }

    init() {
        this.loadPosters();
        this.renderGallery();
    }

    loadPosters() {
        // Generate poster data for images 1-13
        for (let i = 1; i <= 13; i++) {
            this.posters.push({
                id: i,
                filename: `${i}.jpg`,
                title: `Poster ${i}`,
                alt: `Poster ${i}`
            });
        }
    }

    renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        galleryGrid.innerHTML = '';

        this.posters.forEach((poster, index) => {
            const posterElement = this.createPosterElement(poster, index);
            galleryGrid.appendChild(posterElement);
        });
    }

    createPosterElement(poster, index) {
        const posterDiv = document.createElement('div');
        posterDiv.className = 'poster-item loading';
        posterDiv.dataset.index = index;

        const img = document.createElement('img');
        img.src = poster.filename;
        img.alt = poster.alt;

        const overlay = document.createElement('div');
        overlay.className = 'poster-overlay';

        const title = document.createElement('div');
        title.className = 'poster-title';
        title.textContent = poster.title;

        const number = document.createElement('div');
        number.className = 'poster-number';
        number.textContent = `#${poster.id}`;

        overlay.appendChild(title);
        overlay.appendChild(number);
        posterDiv.appendChild(img);
        posterDiv.appendChild(overlay);

        // Handle image load
        img.onload = () => {
            posterDiv.classList.remove('loading');
        };

        img.onerror = () => {
            posterDiv.classList.remove('loading');
            posterDiv.style.background = '#333';
            img.style.display = 'none';
            
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #666;
                font-size: 1.2rem;
            `;
            errorMsg.textContent = 'Image not found';
            posterDiv.appendChild(errorMsg);
        };

        // Click event for fullscreen
        posterDiv.addEventListener('click', () => {
            this.openFullscreen(index);
        });

        return posterDiv;
    }

    bindEvents() {
        const modal = document.getElementById('fullscreenModal');
        const backdrop = document.getElementById('modalBackdrop');
        const closeBtn = document.getElementById('closeBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Close modal events
        backdrop.addEventListener('click', () => this.closeFullscreen());
        closeBtn.addEventListener('click', () => this.closeFullscreen());

        // Navigation events
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.isModalOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.closeFullscreen();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        });

        // Prevent scrolling when modal is open
        document.addEventListener('keydown', (e) => {
            if (this.isModalOpen && ['ArrowUp', 'ArrowDown', 'Space'].includes(e.key)) {
                e.preventDefault();
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        modal.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        modal.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        // Handle swipe gestures
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }
        };
    }

    openFullscreen(index) {
        this.currentIndex = index;
        this.isModalOpen = true;
        
        const modal = document.getElementById('fullscreenModal');
        const fullscreenImage = document.getElementById('fullscreenImage');
        const imageCounter = document.getElementById('imageCounter');
        
        const poster = this.posters[index];
        fullscreenImage.src = poster.filename;
        fullscreenImage.alt = poster.alt;
        
        imageCounter.textContent = `${index + 1} / ${this.posters.length}`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.updateNavigationButtons();
        
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
            fullscreenImage.focus();
        }, 100);
    }

    closeFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isModalOpen = false;
    }

    previousImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateFullscreenImage();
        }
    }

    nextImage() {
        if (this.currentIndex < this.posters.length - 1) {
            this.currentIndex++;
            this.updateFullscreenImage();
        }
    }

    updateFullscreenImage() {
        const fullscreenImage = document.getElementById('fullscreenImage');
        const imageCounter = document.getElementById('imageCounter');
        
        const poster = this.posters[this.currentIndex];
        
        // Add fade effect during transition
        fullscreenImage.style.opacity = '0.7';
        
        setTimeout(() => {
            fullscreenImage.src = poster.filename;
            fullscreenImage.alt = poster.alt;
            imageCounter.textContent = `${this.currentIndex + 1} / ${this.posters.length}`;
            
            fullscreenImage.style.opacity = '1';
            this.updateNavigationButtons();
        }, 150);
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex === this.posters.length - 1;
    }
}

// Smooth scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PosterGallery();
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading indicator for slow connections
window.addEventListener('load', () => {
    // Remove any remaining loading states
    document.querySelectorAll('.poster-item.loading').forEach(item => {
        item.classList.remove('loading');
    });
});
