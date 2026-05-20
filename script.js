document.addEventListener('DOMContentLoaded', () => {
    const btnJa = document.getElementById('btn-ja');
    const btnEn = document.getElementById('btn-en');
    const body = document.body;

    // Password Overlay Logic
    const passwordInput = document.getElementById('password-input');
    const btnUnlock = document.getElementById('btn-unlock');
    const passwordOverlay = document.getElementById('password-overlay');
    const passwordError = document.getElementById('password-error');
    
    // Check local storage so they don't have to enter it every single time
    if (localStorage.getItem('teamUnlocked') === 'true') {
        unlockPage();
    }
    
    function unlockPage() {
        if(passwordOverlay) passwordOverlay.classList.add('hidden');
        body.classList.remove('locked');
        localStorage.setItem('teamUnlocked', 'true');
    }

    function attemptUnlock() {
        if (passwordInput.value === "2026") {
            passwordError.style.display = 'none';
            unlockPage();
        } else {
            passwordError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    if (btnUnlock) {
        btnUnlock.addEventListener('click', attemptUnlock);
    }
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptUnlock();
        });
    }

    // Language Toggle Logic
    btnJa.addEventListener('click', () => {
        body.classList.remove('lang-en');
        body.classList.add('lang-ja');
        btnJa.classList.add('active');
        btnEn.classList.remove('active');
    });

    btnEn.addEventListener('click', () => {
        body.classList.remove('lang-ja');
        body.classList.add('lang-en');
        btnEn.classList.add('active');
        btnJa.classList.remove('active');
    });

    // Handle scroll styles for navbar (Glassmorphism effect adjustment)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 11, 24, 0.9)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(0, 20, 40, 0.6)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth reveal for cards
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // --- Image Modal Logic ---
    const imageModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.querySelector('.modal-close');
    const zoomableImages = document.querySelectorAll('.zoomable-img');

    if (imageModal && modalImg) {
        zoomableImages.forEach(img => {
            img.addEventListener('click', () => {
                imageModal.style.display = 'block';
                // Trigger class after display change to enable transition
                setTimeout(() => {
                    imageModal.classList.add('show');
                }, 10);
                modalImg.src = img.src; // Keep full src including parameters
                if (modalCaption) {
                    modalCaption.textContent = img.alt || "Wear Information Detail";
                }
                body.classList.add('locked'); // Prevent background scrolling
            });
        });

        const closeModal = () => {
            imageModal.classList.remove('show');
            setTimeout(() => {
                imageModal.style.display = 'none';
            }, 300); // Wait for transition to complete
            // Do not unlock page if password overlay is active
            const isPasswordActive = passwordOverlay && !passwordOverlay.classList.contains('hidden');
            if (!isPasswordActive) {
                body.classList.remove('locked');
            }
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        imageModal.addEventListener('click', (e) => {
            // Close only if clicking the background, not the image itself
            if (e.target === imageModal || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('show')) {
                closeModal();
            }
        });
    }
});
