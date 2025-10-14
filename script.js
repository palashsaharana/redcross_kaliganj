// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
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

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Programs Tab Functionality - Optimized for speed
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    let activeButton = document.querySelector('.tab-btn.active');
    let activePane = document.querySelector('.tab-pane.active');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Skip if already active
            if (button === activeButton) return;
            
            const targetTab = button.getAttribute('data-tab');
            const targetPane = document.getElementById(targetTab);
            
            // Fast class switching
            if (activeButton) activeButton.classList.remove('active');
            if (activePane) activePane.classList.remove('active');
            
            button.classList.add('active');
            targetPane.classList.add('active');
            
            // Update references
            activeButton = button;
            activePane = targetPane;
        });
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.action-card, .service-item, .stat-card, .program-detail, .featured-card');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 30);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Parallax effect for hero section (disabled on mobile to prevent issues)
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const activeSlide = document.querySelector('.slide.active .slide-bg');
        if (activeSlide && scrolled < window.innerHeight) {
            const speed = scrolled * 0.2;
            activeSlide.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Hero Slider Functionality
let currentSlideIndex = 0;
let slides, indicators, totalSlides;
let slideInterval = null;
let isTransitioning = false;

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    totalSlides = slides.length;
    
    if (slides.length > 0) {
        // Ensure first slide is visible immediately
        slides[0].style.opacity = '1';
        slides[0].style.visibility = 'visible';
        slides[0].classList.add('active');
        
        if (indicators[0]) {
            indicators[0].classList.add('active');
        }
        
        // Preload all slide images
        preloadSlideImages();
        
        // Start auto slide after a short delay
        setTimeout(() => {
            startAutoSlide();
        }, 1000);
        
        setupEventListeners();
    }
});

function preloadSlideImages() {
    slides.forEach(slide => {
        const slideBg = slide.querySelector('.slide-bg');
        if (slideBg) {
            const bgImage = slideBg.style.backgroundImage;
            if (bgImage) {
                const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
                const img = new Image();
                img.src = imageUrl;
            }
        }
    });
}

function showSlide(index) {
    if (!slides || !indicators || isTransitioning) return;
    
    isTransitioning = true;
    
    // Remove active class from all slides and indicators
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.visibility = 'hidden';
    });
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    if (slides[index] && indicators[index]) {
        setTimeout(() => {
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
            slides[index].style.visibility = 'visible';
            indicators[index].classList.add('active');
            
            setTimeout(() => {
                isTransitioning = false;
            }, 100);
        }, 50);
    }
    
    currentSlideIndex = index;
}

function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(nextIndex);
}

function prevSlide() {
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    showSlide(prevIndex);
}

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function changeSlide(direction) {
    if (isTransitioning) return;
    
    stopAutoSlide();
    
    if (direction === 1) {
        nextSlide();
    } else {
        prevSlide();
    }
    
    setTimeout(() => {
        startAutoSlide();
    }, 500);
}

function currentSlide(index) {
    if (isTransitioning) return;
    
    stopAutoSlide();
    showSlide(index - 1);
    
    setTimeout(() => {
        startAutoSlide();
    }, 500);
}

function setupEventListeners() {
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoSlide);
        heroSlider.addEventListener('mouseleave', startAutoSlide);

        let touchStartX = 0;
        let touchEndX = 0;

        heroSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        heroSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    changeSlide(1);
                } else {
                    changeSlide(-1);
                }
            }
        }
    }
}

// Image Modal Functions
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = 'block';
    modalImg.src = imageSrc;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside the content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});