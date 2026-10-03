// Contact Form Handler & Interactions
document.addEventListener('DOMContentLoaded', () => {
  const contactMessagesStorageKey = 'oriolaContactFormMessages';
  const contactForm = document.getElementById('contactForm');
  const hireBtn = document.getElementById('hireBtn');
  const contactServiceSelect = document.getElementById('contactService');
  const contactSection = document.getElementById('contact');

  if (contactSection && 'IntersectionObserver' in window) {
    const contactObserver = new IntersectionObserver(([entry]) => {
      contactSection.classList.toggle('is-visible', entry.isIntersecting);
    }, { threshold: 0.2 });

    contactObserver.observe(contactSection);
  }

  // Handle "Hire Me" button click from Hero Section
  if (hireBtn) {
    hireBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Automatically switch the dropdown value to "Hire Me"
      if (contactServiceSelect) {
        contactServiceSelect.value = "Hire Me";
      }

      // Smooth scroll down to the contact section
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const service = contactServiceSelect.value;
      const timeline = document.getElementById('contactTimeline').value.trim();
      const details = document.getElementById('contactDetails').value.trim();
      const status = document.getElementById('contactFormStatus');

      if (!name || !email || !details) {
        status.textContent = 'Please fill in your name, email, and project details.';
        status.classList.add('error');
        return;
      }

      try {
        const savedMessages = localStorage.getItem(contactMessagesStorageKey);
        const messages = savedMessages === null ? [] : JSON.parse(savedMessages);
        if (!Array.isArray(messages)) {
          throw new Error('Saved contact messages have an invalid format.');
        }

        const message = {
          id: window.crypto && typeof window.crypto.randomUUID === 'function'
            ? window.crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name,
          email,
          phone,
          service,
          timeline,
          details,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(contactMessagesStorageKey, JSON.stringify([...messages, message]));
        status.textContent = `Thank you, ${name}! Your message has been saved in this browser.`;
        status.classList.remove('error');
      } catch (error) {
        status.textContent = `Your message could not be saved in this browser: ${error.message}`;
        status.classList.add('error');
        return;
      }

      contactForm.reset();
    });
  }
});