/* Samish Digital Wave — shared interactions */
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Accessible mobile navigation.
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  if (menuButton && menu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menu.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Reveal elements and animate skill bars as they enter the viewport.
  const revealElements = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('in-view'));
    skillBars.forEach((bar) => bar.classList.add('animated'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
    skillBars.forEach((bar) => revealObserver.observe(bar));

    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });
    skillBars.forEach((bar) => skillsObserver.observe(bar));
  }

  // Editable stat counters. Values are intentionally placeholders.
  const counters = document.querySelectorAll('[data-counter]');
  const runCounter = (counter) => {
    const target = Number(counter.dataset.counter || 0);
    const suffix = counter.dataset.suffix || '';
    const duration = reducedMotion ? 0 : 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // Home-page testimonial slider.
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const track = slider.querySelector('.testimonial-track');
    const slides = [...slider.querySelectorAll('.testimonial')];
    const dots = [...slider.querySelectorAll('.slider-dot')];
    const previous = slider.querySelector('[data-prev]');
    const next = slider.querySelector('[data-next]');
    let index = 0;
    let timer;
    const showSlide = (newIndex) => {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== index)));
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
        dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
      });
    };
    const restart = () => {
      if (reducedMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(() => showSlide(index + 1), 6500);
    };
    previous?.addEventListener('click', () => { showSlide(index - 1); restart(); });
    next?.addEventListener('click', () => { showSlide(index + 1); restart(); });
    dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => { showSlide(dotIndex); restart(); }));
    slider.addEventListener('mouseenter', () => window.clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    showSlide(0);
    restart();
  }

  // FAQ accordions.
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
  });

  // Re-apply deep links after fonts and responsive layout have settled.
  if (window.location.hash) {
    const deepLinkTarget = document.querySelector(window.location.hash);
    if (deepLinkTarget) {
      window.setTimeout(() => deepLinkTarget.scrollIntoView({ block: 'start' }), 180);
    }
  }

  // Contact form: validates locally, then sends the request to FormSubmit via AJAX.
  const bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    const status = bookingForm.querySelector('.form-status');
    const fields = [...bookingForm.querySelectorAll('[required]')];
    const formPageUrl = bookingForm.querySelector('[name="_url"]');
    const isFilePreview = window.location.protocol === 'file:';
    if (formPageUrl && !isFilePreview) {
      formPageUrl.value = `${window.location.origin}${window.location.pathname}`;
    }
    const validateField = (field) => {
      const error = document.getElementById(`${field.id}-error`);
      let message = '';
      if (!field.value.trim()) message = 'Please complete this field.';
      else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) message = 'Enter a valid email address.';
      else if (field.type === 'tel' && field.value.replace(/\D/g, '').length < 7) message = 'Enter a valid phone or WhatsApp number.';
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (error) error.textContent = message;
      return !message;
    };
    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });
    bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        status.className = 'form-status error';
        status.textContent = 'Please review the highlighted fields and try again.';
        bookingForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const button = bookingForm.querySelector('[type="submit"]');
      const originalLabel = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending…';
      status.className = 'form-status';
      const provider = bookingForm.dataset.formProvider;
      // FormSubmit cannot use its AJAX endpoint from a file:// page. In that
      // situation, use the normal POST endpoint plus the documented _url field.
      if (isFilePreview) {
        HTMLFormElement.prototype.submit.call(bookingForm);
        return;
      }
      try {
        if (provider !== 'formsubmit') throw new Error('Form provider is not configured');
        const endpoint = bookingForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
        const payload = Object.fromEntries(new FormData(bookingForm).entries());
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false || result.success === 'false') {
          throw new Error(result.message || 'FormSubmit request failed');
        }
        status.className = 'form-status success';
        status.textContent = 'Thank you! Your consultation request has been sent. Samish will be in touch soon.';
        bookingForm.reset();
        fields.forEach((field) => field.setAttribute('aria-invalid', 'false'));
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please try again or contact Samish directly.';
      } finally {
        button.disabled = false;
        button.textContent = originalLabel;
      }
    });
  }
});
