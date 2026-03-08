// OTC Tag - Minimal JS
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Simple form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input, textarea');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            if (!valid) {
                e.preventDefault();
                alert('Please fill all fields');
            }
        });
    }
});
