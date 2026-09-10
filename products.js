/* ==========================================================================
   products.js — Product filtering and cart functionality
   ========================================================================== */

(function () {
  "use strict";

  // Product filter functionality
  function initProductFilters() {
    const filterButtons = document.querySelectorAll(".product-filters button");
    const productCards = document.querySelectorAll(".product-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Show/hide products
        productCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // Cart functionality
  function initCartButtons() {
    const cartButtons = document.querySelectorAll(".product-actions button");

    cartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productCard = button.closest(".product-card");
        const productName = productCard.querySelector(".product-name").textContent;
        const productPrice = productCard.querySelector(".product-price").textContent;

        // Show confirmation
        const originalText = button.textContent;
        button.textContent = "Added! ✓";
        button.style.backgroundColor = "#4CAF50";

        // Reset after 2 seconds
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = "";
        }, 2000);

        // Log to console (replace with actual cart logic)
        console.log(`Added to cart: ${productName} - ${productPrice}`);
      });
    });
  }

  // Initialize on page load
  function init() {
    initProductFilters();
    initCartButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
