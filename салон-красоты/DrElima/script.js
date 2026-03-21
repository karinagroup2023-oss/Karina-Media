/* ===== HEADER ===== */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) stickyCta.classList.toggle('visible', window.scrollY > 600);
});

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

/* Close mobile nav on outside click */
document.addEventListener('click', e => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('active');
        burger.classList.remove('active');
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
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== ACCORDION ===== */
document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const body = item.querySelector('.accordion-body');
        const isOpen = item.classList.contains('open');

        // Close all others
        document.querySelectorAll('.accordion-item.open').forEach(openItem => {
            if (openItem !== item) {
                openItem.classList.remove('open');
                openItem.querySelector('.accordion-body').style.maxHeight = null;
                openItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current
        if (isOpen) {
            item.classList.remove('open');
            body.style.maxHeight = null;
            btn.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 20 + 'px';
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

/* ===== BEFORE/AFTER SLIDER ===== */
document.querySelectorAll('.ba-slider').forEach(slider => {
    const container = slider.closest('.portfolio-item__before-after');
    const before = container.querySelector('.ba-side--before');

    slider.addEventListener('input', () => {
        before.style.right = (100 - slider.value) + '%';
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
    });
}

/* ===== BOOKING FORM ===== */
const bookingForm = document.getElementById('bookingForm');
const bookingDate = document.getElementById('bookingDate');

if (bookingForm && bookingDate) {
    const today = new Date().toISOString().split('T')[0];
    bookingDate.setAttribute('min', today);
    bookingDate.value = today;

    bookingForm.addEventListener('submit', e => {
        e.preventDefault();
        const service = document.getElementById('bookingService').value;
        const master = document.getElementById('bookingMaster').value || 'Любой врач';
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const name = document.getElementById('bookingName').value;
        const phone = document.getElementById('bookingPhone').value;
        const formattedDate = new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

        // Build modal content safely (no innerHTML with user input)
        const modal = document.getElementById('successModal');
        const modalText = document.getElementById('modalText');
        modalText.textContent = '';

        const strong = document.createElement('strong');
        strong.textContent = name;
        const details = document.createElement('span');
        details.style.cssText = 'color:var(--gray-light);font-size:13px';
        details.textContent = `${service} \u2022 ${master} \u2022 ${formattedDate} в ${time}`;

        modalText.appendChild(strong);
        modalText.appendChild(document.createTextNode(', вы записаны!'));
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(details);
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(document.createElement('br'));
        modalText.appendChild(document.createTextNode('Подтверждение отправлено в WhatsApp.'));

        // Open WhatsApp with booking details
        const waText = encodeURIComponent(
            `Здравствуйте! Хочу записаться на приём.\n` +
            `Процедура: ${service}\nВрач: ${master}\n` +
            `Дата: ${formattedDate} в ${time}\n` +
            `Имя: ${name}\nТелефон: ${phone}`
        );
        window.open(`https://wa.me/79000000000?text=${waText}`, '_blank');

        modal.classList.add('active');
        bookingForm.reset();
        bookingDate.value = today;
    });
}

/* ===== MODAL ===== */
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOk) modalOk.addEventListener('click', closeModal);

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
}

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

document.querySelectorAll('.service-card, .master-card, .portfolio-item, .accordion-item, .review-card, .about-feature, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ===== ESCAPE KEY ===== */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
