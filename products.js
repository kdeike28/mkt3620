/* ============================================================================
   products.js — Product filtering
   Shopping cart functionality is shared across all pages in nav.js.
   ============================================================================ */

(function () {
  "use strict";

  function initProductFilters() {
    const filterButtons = document.querySelectorAll(".product-filters button");
    const productCards = document.querySelectorAll(".product-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        productCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          card.style.display = filter === "all" || category === filter ? "flex" : "none";
        });
      });
    });
  }

  function init() {
    initProductFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
