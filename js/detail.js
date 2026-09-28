/**
 * APEC VIET NAM 2027 — Article Detail Page Script
 * Handles reading progress bar, copy link, search modal & responsive nav.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar
  const progressBar = document.getElementById('reading-progress-bar');
  const mainContent = document.getElementById('article-content-body');

  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });

  // 2. Share Buttons: Copy Link
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalTitle = copyBtn.getAttribute('title');
        copyBtn.setAttribute('title', 'Đã sao chép link bài viết!');
        alert('Đã sao chép đường dẫn bài viết vào bộ nhớ tạm!');
        setTimeout(() => copyBtn.setAttribute('title', originalTitle), 2000);
      }).catch(() => {
        alert('Không thể sao chép liên kết!');
      });
    });
  }

  // 3. Header scroll elevation
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // 4. Mobile Nav Drawer Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 5. Language Dropdown
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

  // 6. Header Search Modal Controls
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

    // Results in detail page
    const sampleResults = [
      { title: 'Công tác chuẩn bị Tuần lễ Cấp cao APEC 2027 tại Phú Quốc', category: 'TUẦN LỄ CẤP CAO APEC' },
      { title: 'Hội nghị Các Quan chức Cao cấp APEC (SOM): Thống nhất các ưu tiên hợp tác kinh tế số', category: 'CÁC HỘI NGHỊ SOM' },
      { title: 'Diễn đàn Doanh nghiệp APEC: Kiến nghị chính sách thúc đẩy gói hỗ trợ tài chính cho MSMEs', category: 'TIẾNG NÓI DOANH NGHIỆP' },
      { title: 'Tuyên bố chung Hội nghị Bộ trưởng APEC: Khẳng định cam kết thương mại tự do', category: 'PHÁT BIỂU – TUYÊN BỐ' }
    ].filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));

    if (sampleResults.length > 0 && searchResultsList) {
      searchResultsList.innerHTML = sampleResults.map(m => `
        <li class="search-result-item">
          <a href="detail.html" class="search-result-link">
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
});
