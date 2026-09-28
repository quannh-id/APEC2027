/**
 * APEC VIET NAM 2027 - Category Page Script (NYTimes Style Layout)
 * Handles subcategory filters, news stream loading, search modal, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll visual elevation
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // 2. Mobile Nav Drawer Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on clicking backdrop/link
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Language Dropdown
  const langDropdown = document.getElementById('header-lang-dropdown');
  const langDropdownBtn = document.getElementById('lang-dropdown-btn');

  if (langDropdown && langDropdownBtn) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.toggle('is-open');
      langDropdownBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('is-open');
        langDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDropdown.classList.contains('is-open')) {
        langDropdown.classList.remove('is-open');
        langDropdownBtn.setAttribute('aria-expanded', 'false');
        langDropdownBtn.focus();
      }
    });
  }

  // 4. Header Search Modal Controls
  const searchBtn = document.getElementById('header-search-btn');
  const searchModal = document.getElementById('header-search-modal');
  const searchBackdrop = document.getElementById('search-modal-backdrop');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchInput = document.getElementById('header-search-input');
  const searchEmptyHint = document.getElementById('search-empty-hint');
  const searchResultsList = document.getElementById('search-results-list');
  const searchTagChips = document.querySelectorAll('.search-tag-chip');

  const openSearch = () => {
    if (!searchModal) return;
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput?.focus(), 80);
  };

  const closeSearch = () => {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    if (searchResultsList) {
      searchResultsList.innerHTML = '';
      searchResultsList.style.display = 'none';
    }
    if (searchEmptyHint) searchEmptyHint.style.display = 'flex';
  };

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  const performSearch = (keyword) => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      if (searchResultsList) {
        searchResultsList.innerHTML = '';
        searchResultsList.style.display = 'none';
      }
      if (searchEmptyHint) searchEmptyHint.style.display = 'flex';
      return;
    }

    if (searchClearBtn) searchClearBtn.style.display = 'flex';
    if (searchEmptyHint) searchEmptyHint.style.display = 'none';

    // Index category cards & stream items
    const articles = document.querySelectorAll('.lead-story-card, .secondary-card, .stream-article-item, .spotlight-item, .ranked-item');
    const matches = [];
    const seen = new Set();

    articles.forEach(art => {
      const titleEl = art.querySelector('h2, h3, h4');
      const descEl = art.querySelector('p, .stream-item-excerpt, .lead-story-excerpt');
      const kickerEl = art.querySelector('.article-kicker, .spotlight-cat-tag, .rank-cat');
      
      const title = titleEl ? titleEl.textContent.trim() : '';
      const desc = descEl ? descEl.textContent.trim() : '';
      const cat = kickerEl ? kickerEl.textContent.trim() : 'KINH TẾ APEC';

      if (title && (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q))) {
        if (!seen.has(title)) {
          seen.add(title);
          matches.push({ title, category: cat });
        }
      }
    });

    if (matches.length > 0 && searchResultsList) {
      searchResultsList.innerHTML = matches.map(m => `
        <li class="search-result-item">
          <a href="index.html#news" class="search-result-link">
            <span class="search-result-cat">${m.category}</span>
            <strong class="search-result-title">${m.title}</strong>
          </a>
        </li>
      `).join('');
      searchResultsList.style.display = 'block';
    } else if (searchResultsList) {
      searchResultsList.innerHTML = `
        <li class="search-no-result" style="padding: 24px; text-align: center; color: #64748b;">
          Không tìm thấy bài viết nào phù hợp với từ khóa "<strong>${keyword}</strong>".
        </li>
      `;
      searchResultsList.style.display = 'block';
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }

  if (searchClearBtn && searchInput) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      performSearch('');
    });
  }

  searchTagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const keyword = chip.dataset.keyword || chip.textContent.replace('#', '').trim();
      if (searchInput) {
        searchInput.value = keyword;
        performSearch(keyword);
      }
    });
  });

  // 5. Subcategory Filter Tabs
  const subcatLinks = document.querySelectorAll('.subcat-link');
  const streamCountBadge = document.getElementById('stream-count-badge');

  subcatLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      subcatLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const filter = link.dataset.subcat || 'all';
      const allStreamItems = document.querySelectorAll('.stream-article-item');
      let visibleCount = 0;

      allStreamItems.forEach(item => {
        const itemCat = item.dataset.category || '';
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'grid';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (streamCountBadge) {
        streamCountBadge.textContent = `Hiển thị ${visibleCount} bài viết (${link.textContent.trim()})`;
      }
    });
  });

  // 6. Load More Stream Articles
  const loadMoreBtn = document.getElementById('stream-load-more-btn');
  const streamContainer = document.getElementById('news-stream-list');
  let currentLoadedBatch = 1;

  const additionalArticles = [
    {
      category: 'som',
      kicker: 'CÁC HỘI NGHỊ SOM',
      time: '14 Tháng 10',
      title: 'Nhóm công tác APEC về Kinh tế số và Đổi mới sáng tạo nhóm họp phiên trù bị tại Hà Nội',
      excerpt: 'Đại biểu các nền kinh tế thành viên thảo luận về lộ trình chia sẻ hạ tầng dữ liệu và trao đổi tiêu chuẩn kỹ thuật số.',
      thumb: 'assets/destination/destination-cauhon.png'
    },
    {
      category: 'business',
      kicker: 'TIẾNG NÓI DOANH NGHIỆP',
      time: '13 Tháng 10',
      title: 'Các hiệp hội doanh nghiệp tư nhân APEC cam kết đẩy mạnh đầu tư chuỗi cung ứng mở',
      excerpt: 'Sáng kiến giảm chi phí vận chuyển hàng hóa lên tới 18%, đồng thời giúp kết nối thông suốt chuỗi giá trị nông sản sang các thị trường APEC.',
      thumb: 'assets/destination/destination-featured.png'
    }
  ];

  if (loadMoreBtn && streamContainer) {
    loadMoreBtn.addEventListener('click', () => {
      const btnText = loadMoreBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Đang tải thêm tin...';
      loadMoreBtn.style.opacity = '0.7';

      setTimeout(() => {
        additionalArticles.forEach(item => {
          const article = document.createElement('article');
          article.className = 'stream-article-item';
          article.setAttribute('data-category', item.category);
          article.style.animation = 'categoryFadeIn 0.4s ease-out';
          article.innerHTML = `
            <div class="stream-item-main">
              <div class="stream-meta">
                <span class="article-kicker">${item.kicker}</span>
                <span class="article-dot">·</span>
                <time>${item.time}</time>
              </div>
              <h3 class="stream-item-title">
                <a href="index.html#news">${item.title}</a>
              </h3>
              <p class="stream-item-excerpt">${item.excerpt}</p>
            </div>
            <div class="stream-item-thumb">
              <a href="index.html#news" tabindex="-1" aria-hidden="true">
                <img src="${item.thumb}" alt="${item.title}" loading="lazy" />
              </a>
            </div>
          `;
          streamContainer.appendChild(article);
        });

        currentLoadedBatch++;
        if (btnText) btnText.textContent = 'Xem thêm tin tức cũ hơn';
        loadMoreBtn.style.opacity = '1';

        const totalItems = streamContainer.querySelectorAll('.stream-article-item').length;
        if (streamCountBadge) {
          streamCountBadge.textContent = `Hiển thị ${totalItems} / 24 bài viết`;
        }

        if (currentLoadedBatch >= 2) {
          loadMoreBtn.style.display = 'none';
        }
      }, 400);
    });
  }
});
