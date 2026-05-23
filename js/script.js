// Smooth Scroll Behavior
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

// Handle Contact Form
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Validate form
    if (!name || !email || !message) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    // Success message
    alert(`شكراً لتواصلك معنا يا ${name}! سنرد عليك قريباً على ${email}`);
    this.reset();
});

// Start Learning Button
document.querySelector('.btn')?.addEventListener('click', function() {
    const coursesSection = document.querySelector('#courses');
    coursesSection.scrollIntoView({ behavior: 'smooth' });
});

// Animate elements on scroll
window.addEventListener('scroll', function() {
    const cards = document.querySelectorAll('.course-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible) {
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Course Button Interaction
document.querySelectorAll('.btn-small').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const courseName = this.parentElement.querySelector('h3').textContent;
        alert(`سيتم توجيهك إلى دورة: ${courseName} قريباً!`);
    });
});