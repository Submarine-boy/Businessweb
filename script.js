const config = window.SITE_CONFIG || {};

// Apply the central config so each restaurant can be personalized without rebuilding the UI.
const getValue = path => path.split('.').reduce((value, key) => value?.[key], config);
document.querySelectorAll('[data-config]').forEach(element => {
    const value = getValue(element.dataset.config);
    if (value !== undefined) element.innerHTML = value;
});
document.querySelectorAll('[data-config-href]').forEach(element => {
    const value = getValue(element.dataset.configHref);
    if (value) element.href = `mailto:${value}`;
});

if (config.seo) {
    document.title = config.seo.title || document.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && config.seo.description) description.content = config.seo.description;
}

if (config.theme) {
    document.documentElement.style.setProperty('--accent', config.theme.accent || '#d2c196');
    document.documentElement.style.setProperty('--dark', config.theme.dark || '#24251f');
    document.documentElement.style.setProperty('--paper', config.theme.paper || '#f4f0e8');
}

if (config.hero?.image) {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) heroImage.style.backgroundImage = `url("${config.hero.image}")`;
}

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        const open = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!open));
        menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
        mobileNav.classList.toggle('open', !open);
    });

    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        mobileNav.classList.remove('open');
    }));
}

const reservationForm = document.querySelector('#reservation-form');
const formNote = document.querySelector('#form-note');
if (reservationForm && formNote) {
    const dateInput = reservationForm.querySelector('input[type="date"]');
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    reservationForm.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(reservationForm);
        const date = new Date(`${data.get('date')}T12:00:00`);
        const formatted = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        formNote.textContent = `Thanks — we're checking ${data.get('guests')} for ${formatted} at ${data.get('time')}. This demo does not process live bookings.`;
    });
}

const revealItems = document.querySelectorAll('.dish-card,.gallery-image,.story-content,.visit-grid');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach(item => {
        item.classList.add('reveal');
        observer.observe(item);
    });
}
