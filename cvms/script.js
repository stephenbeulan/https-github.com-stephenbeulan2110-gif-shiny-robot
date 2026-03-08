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

// Contact form handling
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        const formData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Store in localStorage (in a real app, this would be sent to server)
        let contacts = JSON.parse(localStorage.getItem('cvms_contacts') || '[]');
        contacts.push(formData);
        localStorage.setItem('cvms_contacts', JSON.stringify(contacts));

        showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

function showMessage(text, type) {
    formMessage.innerHTML = `<p class="${type}">${text}</p>`;
    setTimeout(() => {
        formMessage.innerHTML = '';
    }, 5000);
}

// Add fade-in animation on scroll
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

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target.toLocaleString() + (stat.textContent.includes('%') ? '%' : '+');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current).toLocaleString() + (stat.textContent.includes('%') ? '%' : '+');
            }
        }, 20);
    });
}

// Trigger stats animation when about section is visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(aboutSection);
}

// Mobile menu toggle
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
}

// Add mobile menu button if needed
if (window.innerWidth <= 768) {
    const nav = document.querySelector('nav');
    const menuButton = document.querySelector('.menu-toggle') || document.createElement('button');
    menuButton.textContent = '☰';
    menuButton.className = 'menu-toggle';
    menuButton.onclick = toggleMenu;
    if (!document.querySelector('.menu-toggle')) {
        nav.appendChild(menuButton);
    }
}