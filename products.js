/* ==========================================================================
   products.js — Product filtering and shopping cart functionality
   ========================================================================== */

(function () {
  "use strict";

  const CART_KEY = "freshPressCart";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

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

  function initCart() {
    const cartButton = document.querySelector(".cart-button");
    const cartPanel = document.querySelector(".cart-panel");
    const cartOverlay = document.querySelector(".cart-overlay");
    const closeCart = document.querySelector(".cart-close");
    const cartItems = document.querySelector(".cart-items");
    const cartCount = document.querySelector(".cart-count");
    const cartTotal = document.querySelector(".cart-total");

    if (!cartButton || !cartPanel) return;

    function renderCart() {
      const cart = getCart();
      const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      cartCount.textContent = itemCount;
      cartCount.hidden = itemCount === 0;
      cartTotal.textContent = `$${total.toFixed(2)}`;

      if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        return;
      }

      cartItems.innerHTML = cart.map((item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <span>$${item.price.toFixed(2)} each</span>
          </div>
          <div class="cart-item-controls">
            <button type="button" data-action="decrease" data-name="${item.name}" aria-label="Decrease ${item.name} quantity">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="increase" data-name="${item.name}" aria-label="Increase ${item.name} quantity">+</button>
          </div>
        </div>
      `).join("");
    }

    function openCart() {
      cartPanel.classList.add("open");
      cartOverlay.classList.add("open");
      cartPanel.setAttribute("aria-hidden", "false");
    }

    function closeCartPanel() {
      cartPanel.classList.remove("open");
      cartOverlay.classList.remove("open");
      cartPanel.setAttribute("aria-hidden", "true");
    }

    cartButton.addEventListener("click", openCart);
    closeCart.addEventListener("click", closeCartPanel);
    cartOverlay.addEventListener("click", closeCartPanel);

    cartItems.addEventListener("click", (event) => {
      const control = event.target.closest("button[data-action]");
      if (!control) return;

      const name = control.dataset.name;
      const cart = getCart();
      const item = cart.find((entry) => entry.name === name);
      if (!item) return;

      if (control.dataset.action === "increase") item.quantity += 1;
      if (control.dataset.action === "decrease") item.quantity -= 1;

      const updatedCart = cart.filter((entry) => entry.quantity > 0);
      saveCart(updatedCart);
      renderCart();
    });

    document.querySelectorAll(".product-actions button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const productCard = button.closest(".product-card");
        const name = productCard.querySelector("h2").textContent.trim();
        const price = parseFloat(productCard.querySelector(".product-price").textContent.replace("$", ""));
        const image = productCard.querySelector("img").getAttribute("src");
        const cart = getCart();
        const existing = cart.find((item) => item.name === name);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ name, price, image, quantity: 1 });
        }

        saveCart(cart);
        renderCart();

        const originalText = button.textContent;
        button.textContent = "Added! ✓";
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      });
    });

    renderCart();
  }

  function init() {
    initProductFilters();
    initCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
