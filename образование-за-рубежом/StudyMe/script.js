/* ===== HEADER ===== */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const stickyCta = document.getElementById('stickyCta');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    if (stickyCta) stickyCta.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('active');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen);
});

/* Close mobile nav on outside click */
document.addEventListener('click', e => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
    }
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            nav.classList.remove('active');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== REVIEWS SLIDER ===== */
const reviewsSlider = document.getElementById('reviewsSlider');
const dotsContainer = document.getElementById('reviewsDots');

if (reviewsSlider && dotsContainer) {
    const reviewCards = reviewsSlider.querySelectorAll('.review-card');

    reviewCards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
        dot.addEventListener('click', () => {
            reviewCards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
        dotsContainer.appendChild(dot);
    });

    reviewsSlider.addEventListener('scroll', () => {
        const scrollLeft = reviewsSlider.scrollLeft;
        const cardWidth = reviewCards[0].offsetWidth + 20;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }, { passive: true });
}

/* ===== BOOKING FORM ===== */
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('bookingName').value;
        const phone = document.getElementById('bookingPhone').value;
        const email = document.getElementById('bookingEmail').value;
        const program = document.getElementById('bookingProgram').value;
        const country = document.getElementById('bookingCountry').value || 'Не определился';

        // Build modal content safely
        const modal = document.getElementById('successModal');
        const modalText = document.getElementById('modalText');
        modalText.textContent = '';

        const strong = document.createElement('strong');
        strong.textContent = name;
        const details = document.createElement('span');
        details.style.cssText = 'color:var(--gray-600);font-size:14px';
        details.textContent = `${program} · ${country}`;

        modalText.appendChild(strong);
        modalText.appendChild(document.createTextNode(', спасибо за заявку!'));
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(details);
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(document.createTextNode('Мы свяжемся с вами в течение 24 часов.'));

        // Open WhatsApp with details
        const waText = encodeURIComponent(
            `Здравствуйте! Хочу получить консультацию.\n` +
            `Программа: ${program}\nСтрана: ${country}\n` +
            `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email}`
        );
        window.open(`https://wa.me/70000000000?text=${waText}`, '_blank');

        openModal(modal);
        bookingForm.reset();
    });
}

/* ===== MODAL ===== */
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalOk = document.getElementById('modalOk');

let previousFocus = null;

function openModal(modal) {
    if (!modal) return;
    previousFocus = document.activeElement;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const content = modal.querySelector('.modal__content');
    if (content) content.focus();
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOk) modalOk.addEventListener('click', closeModal);

/* Focus trap inside modal */
document.addEventListener('keydown', e => {
    const modal = document.getElementById('successModal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeModal();
        return;
    }

    if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }
});

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.program-card, .country-card, .camp-feature, .camp-card, .process-step, .review-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
