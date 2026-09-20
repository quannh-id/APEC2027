/**
 * APEC VIET NAM 2027 — News & Events Section Logic
 * Handles category filter selection
 */
document.addEventListener("DOMContentLoaded", () => {
  const filterPills = document.querySelectorAll(".news-cat-pill");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });
});
