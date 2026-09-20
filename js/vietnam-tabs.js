/**
 * APEC VIET NAM 2027 — Vietnam & APEC 2027 Interactive Component
 * Handles sidebar tab switching, keyboard accessibility, smooth animations, and bilingual toggling.
 * Aligned with Figma node 69:216 spec.
 */

(function () {
  'use strict';

  function initVietnamApecTabs() {
    const tabItems = document.querySelectorAll('.vn-tab-item');
    const showcasePanes = document.querySelectorAll('.vn-showcase-pane');

    if (!tabItems.length || !showcasePanes.length) return;

    function switchTab(targetIndex) {
      tabItems.forEach((tab) => {
        const isMatch = tab.getAttribute('data-tab') === String(targetIndex);
        tab.classList.toggle('active', isMatch);
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        tab.setAttribute('tabindex', isMatch ? '0' : '-1');

        // Update arrow color if svg exists
        const circle = tab.querySelector('.vn-tab-arrow circle');
        if (circle) {
          circle.setAttribute('fill', isMatch ? '#ffffff' : '#d9d9d9');
        }
        const path = tab.querySelector('.vn-tab-arrow path');
        if (path) {
          path.setAttribute('stroke', isMatch ? '#1565e8' : '#ffffff');
        }
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

    // Click & Keyboard handlers
    tabItems.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabIndex = tab.getAttribute('data-tab');
        switchTab(tabIndex);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVietnamApecTabs);
  } else {
    initVietnamApecTabs();
  }
})();
