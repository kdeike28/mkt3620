/* ============================================================================
   products.js — Product filtering and clickable product cards
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

  function initProductLinks() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const heading = card.querySelector("h2");
      if (!heading) return;
      const slug = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      card.setAttribute("role", "link");
      card.setAttribute("tabindex", "0");
      card.style.cursor = "pointer";

      const openProduct = (event) => {
        if (event.target.closest("button")) return;
        window.location.href = `product-detail.html?product=${encodeURIComponent(slug)}`;
      };

      card.addEventListener("click", openProduct);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProduct(event);
        }
      });
    });
  }

  function init() {
    initProductFilters();
    initProductLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
