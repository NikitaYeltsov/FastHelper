(function () {
  
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('fasthelper-theme');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeToggle) {
      const text = theme === 'dark' ? 'Dark' : 'Light';
      const icon = theme === 'dark' ? '🌙' : '🌤️';
      themeToggle.querySelector('.theme-text').textContent = text;
      themeToggle.querySelector('.theme-icon').textContent = icon;
    }
  }
  applyTheme(savedTheme || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('fasthelper-theme', next);
    });
  }

  
  document.querySelectorAll('[data-category-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.getAttribute('data-category-link');
      const targetBtn = document.querySelector(`.filter-btn[data-category="${cat}"]`);
      if (targetBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        currentCategory = cat;
        applyFilters();
        window.scrollTo({ top: document.getElementById('toolsContainer').offsetTop - 60, behavior: 'smooth' });
      } else {
        
      }
    });
  });

 
  const toolsContainer = document.getElementById('toolsContainer');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const page = toolsContainer?.dataset?.page || 'all';

  let currentCategory = page === 'graphics' ? 'graphics' : 'all';
  let query = '';

  function renderCards(items) {
    toolsContainer.innerHTML = '';
    if (!items.length) {
      toolsContainer.innerHTML = `
        <article class="card" style="grid-column: 1 / -1;">
          <h3>Nothing found</h3>
          <p>Try changing your query or category.</p>
          <div class="actions"><button class="btn" type="button" id="resetFilters">Reset</button></div>
        </article>`;
      const resetBtn = document.getElementById('resetFilters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          query = '';
          if (searchInput) searchInput.value = '';
          currentCategory = 'all';
          filterButtons.forEach(b => b.classList.remove('active'));
          const allBtn = document.querySelector('.filter-btn[data-category="all"]');
          if (allBtn) allBtn.classList.add('active');
          applyFilters();
        });
      }
      return;
    }

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="icon-wrap">
          <img src="${item.icon}" alt="" aria-hidden="true" width="28" height="28">
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="actions">
          <a class="btn primary" href="${item.url}" target="_blank" rel="noopener">Open</a>
          <button class="btn" type="button" aria-label="Copy link" data-url="${item.url}">Copy</button>
        </div>
      `;
      toolsContainer.appendChild(card);
    });

  
    toolsContainer.querySelectorAll('button[data-url]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const url = e.currentTarget.dataset.url;
        try {
          await navigator.clipboard.writeText(url);
          e.currentTarget.textContent = 'Copied';
          setTimeout(() => (e.currentTarget.textContent = 'Copy'), 1200);
        } catch {
          e.currentTarget.textContent = 'Error';
          setTimeout(() => (e.currentTarget.textContent = 'Copy'), 1200);
        }
      });
    });
  }

  function applyFilters() {
    const normalizedQuery = query.trim().toLowerCase();
    let filtered = TOOLS.slice();

    if (currentCategory !== 'all') {
      filtered = filtered.filter(t => t.category === currentCategory);
    }
    if (normalizedQuery) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(normalizedQuery) ||
        t.description.toLowerCase().includes(normalizedQuery)
      );
    }

    renderCards(filtered);
  }

  renderCards(
    currentCategory === 'all' ? TOOLS : TOOLS.filter(t => t.category === currentCategory)
  );


  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      query = e.target.value;
      applyFilters();
    });
  }

  
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      query = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyFilters();
    });
  }

 
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      applyFilters();
    });
  });
})();
