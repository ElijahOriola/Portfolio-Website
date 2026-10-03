// Dedicated JS for Portfolio Section - Grid Generation & Filtering
document.addEventListener('DOMContentLoaded', () => {
  const portfolioGrid = document.getElementById('portfolioGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');

  const portfolioItems = [
    { id: 1, title: "Zalwa Minimal Portfolio", category: "web", categoryLabel: "Website Design", image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Dark Aesthetic Showcase", category: "web", categoryLabel: "Website Design", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Undercover Sleek Concept", category: "web", categoryLabel: "Website Design", image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Fintech Dashboard Mobile", category: "mobile", categoryLabel: "App Mobile", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "Soundproof Music Player", category: "mobile", categoryLabel: "App Mobile", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Crypto Desktop Terminal", category: "desktop", categoryLabel: "App Desktop", image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=600&q=80" },
    { id: 7, title: "E-Commerce System Arc", category: "web", categoryLabel: "Website Design", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" },
    { id: 8, title: "Braiding Studio Brand", category: "branding", categoryLabel: "Branding", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80" },
    { id: 9, title: "Cybersecurity Portal", category: "desktop", categoryLabel: "App Desktop", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80" },
    { id: 10, title: "Smart Home Controller", category: "mobile", categoryLabel: "App Mobile", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80" },
    { id: 11, title: "Minimalist Identity", category: "branding", categoryLabel: "Branding", image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80" },
    { id: 12, title: "Cloud Admin Station", category: "desktop", categoryLabel: "App Desktop", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80" },
    { id: 13, title: "SaaS Analytics Web", category: "web", categoryLabel: "Website Design", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80" },
    { id: 14, title: "Fitness Companion App", category: "mobile", categoryLabel: "App Mobile", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80" },
    { id: 15, title: "Luxury Agency Rebrand", category: "branding", categoryLabel: "Branding", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" },
    { id: 16, title: "AI Code Editor Suite", category: "desktop", categoryLabel: "App Desktop", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80" }
  ];

  function renderPortfolio(items) {
    if (!portfolioGrid) return;
    
    portfolioGrid.innerHTML = items.map(item => `
      <div class="portfolio-card" data-category="${item.category}" data-id="${item.id}">
        <div class="portfolio-card-img-wrapper">
          <img src="${item.image}" alt="${item.title}" class="portfolio-card-img" />
        </div>
        <div class="portfolio-card-info">
          <span class="portfolio-card-title">${item.title}</span>
          <span class="portfolio-card-category">${item.categoryLabel}</span>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const project = portfolioItems.find(p => p.id == id);
        if (project) openProjectModal(project);
      });
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      if (filterValue === 'all') {
        renderPortfolio(portfolioItems);
      } else {
        const filtered = portfolioItems.filter(item => item.category === filterValue);
        renderPortfolio(filtered);
      }
    });
  });

  function openProjectModal(project) {
    const modalOverlay = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');

    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
      <h2 class="modal-header-title">${project.title}</h2>
      <p class="modal-header-sub">Category: ${project.categoryLabel}</p>
      
      <img class="modal-platform-img" src="${project.image}" alt="${project.title}" style="width:100%; border-radius:8px; margin:15px 0;" />

      <h3 class="modal-section-title">Project Details</h3>
      <p style="color: #B0B0B0; font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px;">
        Designed and engineered as part of the ${project.categoryLabel} series. Features optimized asset structures, responsive viewports, and clean UI components.
      </p>

      <div class="modal-actions">
        <button class="btn btn-primary" onclick="alert('Opening live preview for ${project.title}')">View Live Demo</button>
      </div>
    `;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  renderPortfolio(portfolioItems);
});