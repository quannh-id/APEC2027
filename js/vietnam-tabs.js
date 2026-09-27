/**
 * APEC VIET NAM 2027 — Vietnam & APEC Interactive Host Years Timeline & Tabs Component
 * Handles host year timeline (2006, 2017, 2027), active node horizontal centering,
 * dynamic multi-year content switching, sidebar tabs, and bilingual localization.
 */

(function () {
  'use strict';

  const yearDescriptions = {
    '2006': {
      vi: 'APEC 2006 tại Hà Nội đánh dấu bước ngoặt lịch sử khi Việt Nam lần đầu tiên đăng cai Diễn đàn, mở đường cho việc gia nhập WTO và khẳng định vị thế một nền kinh tế năng động, đổi mới.',
      en: 'APEC 2006 in Ha Noi marked a historic turning point as Viet Nam hosted the Forum for the first time, paving the path to WTO accession and asserting its stature as a dynamic, reform-minded economy.'
    },
    '2017': {
      vi: 'APEC 2017 tại Đà Nẵng khẳng định tầm vóc đối ngoại chiến lược của Việt Nam: từ vị thế hội nhập chuyển sang chủ động dẫn dắt, khởi xướng Tầm nhìn APEC 2040 và củng cố hợp tác thương mại đa phương.',
      en: 'APEC 2017 in Da Nang reaffirmed Viet Nam\'s strategic diplomatic stature: transitioning from integration to proactive leadership, formulating the APEC Vision 2040 and reinforcing multilateral trade cooperation.'
    },
    '2027': {
      vi: 'Trở thành nền kinh tế nước chủ nhà, Việt Nam sẽ đón nhận cả thách thức và cơ hội lớn để khẳng định bản lĩnh hội nhập, định hình tương lai số bền vững cùng châu Á – Thái Bình Dương',
      en: 'As the host economy, Viet Nam will embrace both profound opportunities and pivotal challenges to assert its integration acumen, shaping a resilient and sustainable digital future alongside the Asia-Pacific.'
    }
  };

  let currentActiveYear = '2027';

  function centerTimelineNode(node) {
    const track = document.getElementById('vn-timeline-track');
    const firstNode = document.getElementById('vn-year-node-2006');
    const lastNode = document.getElementById('vn-year-node-2027');
    const baseLine = document.getElementById('vn-timeline-base-line');
    const activeLine = document.getElementById('vn-timeline-active-line');
    if (!track || !node) return;

    // trackCenter is center of track; nodeCenter is center of active node in track coordinates
    const trackCenter = track.offsetWidth / 2;
    const nodeCenter = node.offsetLeft + (node.offsetWidth / 2);
    const targetX = trackCenter - nodeCenter;

    track.style.transform = `translateX(${targetX}px)`;

    // Update base line connecting first dot to last dot
    if (baseLine && firstNode && lastNode) {
      const startX = firstNode.offsetLeft + (firstNode.offsetWidth / 2);
      const endX = lastNode.offsetLeft + (lastNode.offsetWidth / 2);
      baseLine.style.left = `${startX}px`;
      baseLine.style.width = `${endX - startX}px`;
    }

    // Update active line progress width from first node (2006) to active node
    if (activeLine && firstNode) {
      const startX = firstNode.offsetLeft + (firstNode.offsetWidth / 2);
      const endX = node.offsetLeft + (node.offsetWidth / 2);
      const width = Math.max(0, endX - startX);
      activeLine.style.left = `${startX}px`;
      activeLine.style.width = `${width}px`;
    }
  }

  function selectYear(year) {
    currentActiveYear = String(year);
    const nodes = document.querySelectorAll('.vn-timeline-node');
    const yearContents = document.querySelectorAll('.vn-year-content');
    const descEl = document.getElementById('vn-section-desc');
    let activeNode = null;

    nodes.forEach((node) => {
      const isMatch = node.getAttribute('data-year') === currentActiveYear;
      node.classList.toggle('active', isMatch);
      node.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      if (isMatch) activeNode = node;
    });

    if (activeNode) {
      centerTimelineNode(activeNode);
    }

    // Update description with bilingual support
    if (descEl && yearDescriptions[currentActiveYear]) {
      const isVi = document.documentElement.lang !== 'en';
      descEl.setAttribute('data-i18n-vi', yearDescriptions[currentActiveYear].vi);
      descEl.setAttribute('data-i18n-en', yearDescriptions[currentActiveYear].en);
      descEl.textContent = isVi ? yearDescriptions[currentActiveYear].vi : yearDescriptions[currentActiveYear].en;
    }

    // Toggle year content container
    yearContents.forEach((yc) => {
      const isMatch = yc.getAttribute('data-year') === currentActiveYear;
      yc.classList.toggle('active', isMatch);
      if (isMatch) {
        // Reset tab to 1 if needed
        const firstTab = yc.querySelector('.vn-tab-item[data-tab="1"]');
        if (firstTab && !yc.querySelector('.vn-tab-item.active')) {
          firstTab.click();
        }
      }
    });
  }

  function initYearTabs(yearContainer) {
    const tabItems = yearContainer.querySelectorAll('.vn-tab-item');
    const showcasePanes = yearContainer.querySelectorAll('.vn-showcase-pane');

    if (!tabItems.length || !showcasePanes.length) return;

    function switchTab(targetIndex) {
      tabItems.forEach((tab) => {
        const isMatch = tab.getAttribute('data-tab') === String(targetIndex);
        tab.classList.toggle('active', isMatch);
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        tab.setAttribute('tabindex', isMatch ? '0' : '-1');

        const circle = tab.querySelector('.vn-tab-arrow circle');
        if (circle) circle.setAttribute('fill', isMatch ? '#ffffff' : '#d9d9d9');
        const path = tab.querySelector('.vn-tab-arrow path');
        if (path) path.setAttribute('stroke', isMatch ? '#1565e8' : '#ffffff');
      });

      showcasePanes.forEach((pane) => {
        const isMatch = pane.getAttribute('data-pane') === String(targetIndex);
        if (isMatch) {
          pane.classList.add('active');
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(
              pane,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform' }
            );
          }
        } else {
          pane.classList.remove('active');
        }
      });
    }

    tabItems.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(tab.getAttribute('data-tab'));
      });

      tab.addEventListener('keydown', (e) => {
        const tabsArray = Array.from(tabItems);
        const currentIndex = tabsArray.indexOf(tab);
        let nextIndex = null;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabsArray.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = tabsArray.length - 1;
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchTab(tab.getAttribute('data-tab'));
        }

        if (nextIndex !== null) {
          tabsArray[nextIndex].focus();
          switchTab(tabsArray[nextIndex].getAttribute('data-tab'));
        }
      });
    });
  }

  function initVietnamTimeline() {
    const nodes = document.querySelectorAll('.vn-timeline-node');
    const yearContents = document.querySelectorAll('.vn-year-content');

    // Initialize tabs inside each year container
    yearContents.forEach((yc) => {
      initYearTabs(yc);
    });

    // Timeline node click handlers
    nodes.forEach((node) => {
      node.addEventListener('click', (e) => {
        e.preventDefault();
        const year = node.getAttribute('data-year');
        selectYear(year);
      });
    });

    // Window resize handler to maintain active node centering
    window.addEventListener('resize', () => {
      const activeNode = document.querySelector(`.vn-timeline-node[data-year="${currentActiveYear}"]`);
      if (activeNode) {
        centerTimelineNode(activeNode);
      }
    });

    // Initial center on 2027 after rendering (immediate + post font load)
    const runInitialCenter = () => {
      const initialNode = document.querySelector(`.vn-timeline-node[data-year="${currentActiveYear}"]`);
      if (initialNode) {
        centerTimelineNode(initialNode);
      }
    };

    runInitialCenter();
    requestAnimationFrame(runInitialCenter);
    setTimeout(runInitialCenter, 60);
    setTimeout(runInitialCenter, 200);
    window.addEventListener('load', runInitialCenter);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(runInitialCenter);
    }

    // Expose selectYear globally for tests or cross-component triggers
    window.selectVietnamHostYear = selectYear;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVietnamTimeline);
  } else {
    initVietnamTimeline();
  }
})();
