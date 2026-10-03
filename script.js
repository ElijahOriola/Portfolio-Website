document.addEventListener('DOMContentLoaded', () => {
  const heroTitleText = document.getElementById('heroTitleText');
  const typingCursor = document.querySelector('.typing-cursor');

  if (heroTitleText && typingCursor) {
    const titlePhrases = ['IT Student', 'Tech Specialist'];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroTitleText.textContent = titlePhrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = 0;
      let isDeleting = false;

      function animateTitle() {
        const phrase = titlePhrases[phraseIndex];

        if (isDeleting) {
          characterIndex -= 1;
        } else {
          characterIndex += 1;
        }

        heroTitleText.textContent = phrase.slice(0, characterIndex);

        let delay = isDeleting ? 45 : 90;
        if (!isDeleting && characterIndex === phrase.length) {
          isDeleting = true;
          delay = 1000;
        } else if (isDeleting && characterIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % titlePhrases.length;
          delay = 300;
        }

        window.setTimeout(animateTitle, delay);
      }

      heroTitleText.textContent = '';
      window.setTimeout(animateTitle, 250);
    }
  }

  const navLinks = document.querySelectorAll('.nav-tabs a');
  const sections = document.querySelectorAll('main[id], section[id]');

  function setActiveTab(id) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveTab(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      if (this.classList.contains('active')) {
        e.preventDefault();
        return;
      }

      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});