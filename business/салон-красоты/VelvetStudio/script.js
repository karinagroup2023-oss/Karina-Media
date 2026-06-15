/* ===== HEADER ===== */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    // Sticky CTA
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) stickyCta.classList.toggle('visible', window.scrollY > 600);
});

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

/* Mobile nav */
const style = document.createElement('style');
style.textContent = `.nav.active{display:flex;flex-direction:column;position:absolute;top:72px;left:0;right:0;background:#fff;padding:24px;gap:16px;border-bottom:1px solid var(--border);box-shadow:var(--shadow)}`;
document.head.appendChild(style);

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

/* ===== PORTFOLIO TABS ===== */
document.querySelectorAll('.portfolio-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const type = tab.dataset.tab;
        document.querySelectorAll('.portfolio-item').forEach(item => {
            if (type === 'all' || item.dataset.type === type) {
                item.style.display = '';
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.style.display = 'none';
            }
        });
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

/* ===== BOOKING FORM ===== */
const bookingForm = document.getElementById('bookingForm');
const bookingDate = document.getElementById('bookingDate');

// Set min date to today
const today = new Date().toISOString().split('T')[0];
bookingDate.setAttribute('min', today);
bookingDate.value = today;

bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const service = document.getElementById('bookingService').value;
    const master = document.getElementById('bookingMaster').value || 'Любой мастер';
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const name = document.getElementById('bookingName').value;

    const modal = document.getElementById('successModal');
    const modalText = document.getElementById('modalText');
    modalText.innerHTML = `
        <strong>${name}</strong>, вы записаны!<br>
        <span style="color:var(--gray);font-size:13px">
            ${service} • ${master}<br>
            ${new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в ${time}
        </span><br><br>
        Подтверждение отправлено в WhatsApp.
    `;
    modal.classList.add('active');
    bookingForm.reset();
    bookingDate.value = today;
});

/* ===== MODAL ===== */
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOk').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
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

document.querySelectorAll('.service-card, .master-card, .portfolio-item, .price-card, .review-card, .advantage, .about-feature, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ===== ESCAPE KEY ===== */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});
