/* ===== HEADER ===== */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const stickyCta = document.getElementById('stickyCta');

document.documentElement.classList.add('js-loaded');

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

/* Close mobile nav on Escape */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
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

/* ===== DYNAMIC YEARS ===== */
const yearsEl = document.getElementById('yearsExperience');
if (yearsEl) {
    const years = new Date().getFullYear() - 2018;
    yearsEl.textContent = years + ' ' + (years === 1 ? 'год' : (years >= 2 && years <= 4) ? 'года' : 'лет');
}

/* ===== BOOKING FORM ===== */
const bookingForm = document.getElementById('bookingForm');
const bookingProgram = document.getElementById('bookingProgram');
const bookingCountry = document.getElementById('bookingCountry');

if (bookingProgram && bookingCountry) {
    const allOptions = [...bookingCountry.options].map(o => ({ value: o.value, text: o.textContent }));
    const campCountries = ['', 'Англия', 'Южная Корея'];

    bookingProgram.addEventListener('change', () => {
        const prev = bookingCountry.value;
        bookingCountry.innerHTML = '';
        const list = bookingProgram.value === 'Языковой лагерь'
            ? allOptions.filter(o => campCountries.includes(o.value))
            : allOptions;
        list.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.value;
            opt.textContent = o.text;
            if (o.value === prev) opt.selected = true;
            bookingCountry.appendChild(opt);
        });
    });
}

/* Form validation helpers */
function validatePhone(phone) {
    return /^\+?[\d\s\-()]{7,15}$/.test(phone.trim());
}

function validateEmail(email) {
    if (!email.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function showFieldError(input, message) {
    clearFieldError(input);
    input.classList.add('input--error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.textContent = message;
    input.parentNode.appendChild(err);
}

function clearFieldError(input) {
    input.classList.remove('input--error');
    const existing = input.parentNode.querySelector('.field-error');
    if (existing) existing.remove();
}

if (bookingForm) {
    const submitBtn = bookingForm.querySelector('button[type="submit"]');

    bookingForm.addEventListener('submit', e => {
        e.preventDefault();

        const nameInput = document.getElementById('bookingName');
        const phoneInput = document.getElementById('bookingPhone');
        const emailInput = document.getElementById('bookingEmail');
        const programSelect = document.getElementById('bookingProgram');
        const consentCheckbox = document.getElementById('bookingConsent');
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const program = programSelect.value;
        const country = document.getElementById('bookingCountry').value || 'Не определился';

        /* Clear previous errors */
        [nameInput, phoneInput, emailInput, programSelect].forEach(clearFieldError);
        let hasError = false;

        if (!name) {
            showFieldError(nameInput, 'Введите ваше имя');
            hasError = true;
        }
        if (!validatePhone(phone)) {
            showFieldError(phoneInput, 'Введите корректный номер телефона');
            hasError = true;
        }
        if (!validateEmail(email)) {
            showFieldError(emailInput, 'Введите корректный email');
            hasError = true;
        }
        if (!program) {
            showFieldError(programSelect, 'Выберите программу');
            hasError = true;
        }
        if (!consentCheckbox.checked) {
            showFieldError(consentCheckbox, 'Необходимо согласие на обработку данных');
            hasError = true;
        }
        if (hasError) return;

        /* Disable button to prevent double submit */
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

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

        // Build WhatsApp URL
        const waText = encodeURIComponent(
            `Здравствуйте! Хочу получить консультацию.\n` +
            `Программа: ${program}\nСтрана: ${country}\n` +
            `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email}`
        );
        const waUrl = `https://wa.me/77009633931?text=${waText}`;

        // Show modal first, then open WhatsApp
        openModal(modal);
        bookingForm.reset();

        setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }, 1500);
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
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.program-card, .country-card, .camp-feature, .camp-card, .process-step, .review-card, .contact-item').forEach(el => {
    observer.observe(el);
});
