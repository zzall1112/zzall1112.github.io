// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const rsvpForm = document.getElementById('rsvp-form');
const formMessage = document.getElementById('form-message');
const carouselImages = document.querySelector('#carousel-images');
const thumbs = document.querySelectorAll('.thumb');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightboxBtn = document.querySelector('.close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

// Wedding Date for Countdown
const weddingDate = new Date('2024-12-31T16:00:00').getTime();

// 1. Mobile Hamburger Menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 2. Smooth Scrolling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// 3. Scroll Animations (Fade-in Sections)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// 4. Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        countdownEl.innerHTML = `
            <div><span>${days}</span> Days</div>
            <div><span>${hours}</span> Hours</div>
            <div><span>${minutes}</span> Minutes</div>
            <div><span>${seconds}</span> Seconds</div>
        `;
    }

    if (distance < 0) {
        countdownEl.innerHTML = '<div>The big day is here! 🎉</div>';
    }
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// 5. Gallery Carousel
let currentSlideIndex = 0;
const totalSlides = document.querySelectorAll('.carousel-img').length;

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-img');
    const activeThumb = document.querySelector('.thumb.active');

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });

    thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });

    currentSlideIndex = index;
}

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    if (newIndex >= totalSlides) newIndex = 0;
    if (newIndex < 0) newIndex = totalSlides - 1;
    showSlide(newIndex);
}

function currentSlide(index) {
    showSlide(index - 1); // Thumbs are 1-indexed
}

// Auto-slide (optional, comment out if not needed)
setInterval(() => changeSlide(1), 5000);

// Lightbox Functionality
thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const imgSrc = thumb.src;
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    });
});

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Lightbox navigation (sync with carousel)
lightboxNext.addEventListener('click', () => changeSlide(1));
lightboxPrev.addEventListener('click', () => changeSlide(-1));
closeLightboxBtn.addEventListener('click', closeLightbox);

// Close lightbox on outside click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// 6. RSVP Form Validation & Submission
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const attending = document.getElementById('attending').value;
    const errors = document.querySelectorAll('.error');

    let isValid = true;

    // Reset errors
    errors.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    // Name validation
    if (!name) {
        document.querySelector('#name + .error').textContent = 'Name is required';
        document.querySelector('#name + .error').classList.add('show');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.querySelector('#email + .error').textContent = 'Email is required';
        document.querySelector('#email + .error').classList.add('show');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.querySelector('#email + .error').textContent = 'Please enter a valid email';
        document.querySelector('#email + .error').classList.add('show');
        isValid = false;
    }

    // Attending validation
    if (!attending) {
        document.querySelector('#attending + .error').textContent = 'Please select if you can attend';
        document.querySelector('#attending + .error').classList.add('show');
        isValid = false;
    }

    return isValid;
}

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
        formMessage.className = 'message error';
        formMessage.textContent = 'Please fix the errors above.';
        formMessage.style.display = 'block';
        return;
    }

    // Simulate submission (save to localStorage)
    const formData = new FormData(rsvpForm);
    const rsvpData = {
        name: formData.get('name'),
        email: formData.get('email'),
        attending: formData.get('attending'),
        guests: formData.get('guests'),
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('rsvp_' + Date.now(), JSON.stringify(rsvpData));
    console.log('RSVP saved:', rsvpData); // In production, send to server/email

    // Show success
    formMessage.className = 'message success';
    formMessage.textContent = 'Thank you! Your RSVP has been received. We\'ll see you soon! 💕';
    formMessage.style.display = 'block';

    // Reset form
    rsvpForm.reset();
    document.getElementById('guests').value = '1';

    // Disable button temporarily
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    setTimeout(() => {
        submitBtn.disabled = false;
    }, 3000);
});

// Real-time validation on input
['name', 'email', 'attending'].forEach(id => {
    document.getElementById(id).addEventListener('blur', validateForm);
});

// 7. Parallax Effect on Hero Image
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImg = document.getElementById('hero-img');
    if (heroImg) {
        heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});