// Service Details & Modal Interactivity
document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card');
  const modalOverlay = document.getElementById('serviceModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');

  const servicesData = [
    {
      title: "Web Development Platform",
      description: "Full-stack web application development services using modern frameworks. Focused on clean architecture, responsive layouts, and REST API integrations.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      techStack: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "REST APIs"],
      features: [
        "Responsive, mobile-first design implementation",
        "Frontend interface and dynamic UI components",
        "Backend API routing and authentication workflows",
        "Performance optimization and lighthouse auditing"
      ]
    },
    {
      title: "Network & System Infrastructure",
      description: "Designing, setting up, and managing local networks, subnets, routers, and server instances for personal and small-business labs.",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
      techStack: ["Cisco Packet Tracer", "Linux / Ubuntu Server", "TCP/IP", "DNS/DHCP", "VPN"],
      features: [
        "Network topology design and VLAN configuration",
        "Linux/Windows server deployment and maintenance",
        "IP addressing, subnetting, and port forwarding setups",
        "System health monitoring and performance tuning"
      ]
    },
    {
      title: "Database Management System",
      description: "Database architecture design, relational modeling, and SQL query creation to store, manipulate, and secure organization data efficiently.",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
      techStack: ["MySQL", "PostgreSQL", "MongoDB", "ERD Modeling", "SQL"],
      features: [
        "Entity-Relationship Diagram (ERD) design and normalization",
        "Complex SQL queries, joins, and stored procedures",
        "Database backup, restore, and security permissions",
        "NoSQL collections management for scalable apps"
      ]
    },
    {
      title: "Cybersecurity & Vulnerability Audit",
      description: "Identifying system weaknesses, assessing network security, and implementing best security practices to protect critical assets.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
      techStack: ["Kali Linux", "Wireshark", "Nmap", "Metasploit", "OWASP Security"],
      features: [
        "Packet analysis and network traffic inspection",
        "Port scanning and vulnerability assessment",
        "Implementation of multi-factor authentication & SSL/TLS",
        "Security compliance reports and remediation recommendations"
      ]
    },
    {
      title: "IT Support & Technical Diagnostics",
      description: "Hands-on hardware assembly, operating system installation, software troubleshooting, and end-user technical support.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      techStack: ["Windows Admin", "Linux CLI", "Hardware Diagnostics", "Active Directory"],
      features: [
        "OS installation, configuration, and driver updates",
        "Hardware repair, upgrades, and system diagnostics",
        "User access management and permissions configuration",
        "Remote support and technical troubleshooting"
      ]
    },
    {
      title: "Cloud Services & Deployment",
      description: "Deploying applications to cloud environments, configuring virtual machines, containerization, and static hosting platforms.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
      techStack: ["AWS", "Docker", "Vercel", "Git/GitHub", "Netlify"],
      features: [
        "Cloud static website and API deployment",
        "Docker container setup and orchestration basics",
        "Git version control and continuous integration workflows",
        "Storage bucket configuration and access policies"
      ]
    }
  ];

  function openModal(index) {
    const data = servicesData[index];
    if (!data) return;

    modalContent.innerHTML = `
      <h2 class="modal-header-title">${data.title}</h2>
      <p class="modal-header-sub">${data.description}</p>
      
      <img class="modal-platform-img" src="${data.image}" alt="${data.title} Platform Image" />

      <h3 class="modal-section-title">Tech Stack & Tools</h3>
      <div class="modal-tech-tags">
        ${data.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>

      <h3 class="modal-section-title">Key Capabilities</h3>
      <ul class="modal-list">
        ${data.features.map(feat => `<li>${feat}</li>`).join('')}
      </ul>

      <div class="modal-actions">
        <button class="btn btn-primary" onclick="alert('Project platform demo requested for ${data.title}')">View Live Platform</button>
      </div>
    `;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  serviceCards.forEach((card, index) => {
    card.addEventListener('click', () => openModal(index));
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});