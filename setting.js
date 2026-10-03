document.addEventListener('DOMContentLoaded', () => {
  // Inject Settings Toggle Button & Cabinet HTML dynamically if not present
  if (!document.getElementById('settingsToggleBtn')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'settingsToggleBtn';
    toggleBtn.className = 'settings-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Open Settings');
    toggleBtn.innerHTML = '<i class="fas fa-cog"></i>';
    document.body.appendChild(toggleBtn);

    const drawerHtml = `
      <div class="settings-backdrop" id="settingsBackdrop"></div>
      <aside class="settings-drawer" id="settingsDrawer">
        <div class="settings-header">
          <h3>Theme Settings</h3>
          <button class="settings-close-btn" id="settingsCloseBtn" aria-label="Close Settings">&times;</button>
        </div>
        <div class="settings-body">
          <div class="settings-section">
            <h4 class="settings-group-title">Accent Color Theme</h4>
            <div class="color-swatches-grid">
              <div class="color-swatch active" data-color="#FD6F00" style="background-color: #FD6F00;" title="Vibrant Orange"></div>
              <div class="color-swatch" data-color="#3B82F6" style="background-color: #3B82F6;" title="Electric Blue"></div>
              <div class="color-swatch" data-color="#10B981" style="background-color: #10B981;" title="Emerald Green"></div>
              <div class="color-swatch" data-color="#8B5CF6" style="background-color: #8B5CF6;" title="Royal Purple"></div>
              <div class="color-swatch" data-color="#EC4899" style="background-color: #EC4899;" title="Hot Pink"></div>
              <div class="color-swatch" data-color="#F59E0B" style="background-color: #F59E0B;" title="Amber Gold"></div>
              <div class="color-swatch" data-color="#06B6D4" style="background-color: #06B6D4;" title="Cyan Spark"></div>
              <div class="color-swatch" data-color="#EF4444" style="background-color: #EF4444;" title="Crimson Red"></div>
            </div>
          </div>
        </div>
      </aside>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHtml);
  }

  const toggleBtn = document.getElementById('settingsToggleBtn');
  const drawer = document.getElementById('settingsDrawer');
  const backdrop = document.getElementById('settingsBackdrop');
  const closeBtn = document.getElementById('settingsCloseBtn');
  const swatches = document.querySelectorAll('.color-swatch');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Apply color scheme change globally across root & components
  function applyTheme(colorHex) {
    document.documentElement.style.setProperty('--accent-color', colorHex);
    localStorage.setItem('portfolio_accent_color', colorHex);
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const selectedColor = swatch.getAttribute('data-color');
      applyTheme(selectedColor);
    });
  });

  // Load saved theme preference on start/transition
  const savedColor = localStorage.getItem('portfolio_accent_color');
  if (savedColor) {
    applyTheme(savedColor);
    swatches.forEach(swatch => {
      if (swatch.getAttribute('data-color') === savedColor) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }
});