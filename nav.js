/* ============================================================================
   nav.js — shared navigation system
   ============================================================================ */

(function () {
  "use strict";

  const NAV_LINKS = [
    { label: "Home", href: "index.html" },
    { label: "Products", href: "products.html" },
    { label: "Services", href: "services.html" },
    { label: "Contact", href: "contact.html" },
  ];

  const SOCIAL_LINKS = [
    { label: "GitHub", href: "https://github.com/" },
    { label: "Twitter", href: "https://twitter.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
  ];

  function currentFileName() {
    const path = window.location.pathname;
    const last = path.substring(path.lastIndexOf("/") + 1);
    return last === "" ? "index.html" : last;
  }

  function buildList(container, links, { markActive } = {}) {
    if (!container) return;
    const ul = document.createElement("ul");

    links.forEach((link) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;

      if (markActive && link.href === currentFileName()) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }

      li.appendChild(a);
      ul.appendChild(li);
    });

    container.innerHTML = "";
    container.appendChild(ul);
  }

  function renderPrimaryNav() {
    const nav = document.querySelector(".primary-nav");
    if (!nav) return;
    buildList(nav, NAV_LINKS, { markActive: true });
  }

  function renderStudentName() {
    document.querySelectorAll(".header-top").forEach((headerTop) => {
      const logo = headerTop.querySelector(".logo");
      if (!logo || logo.querySelector(".student-name")) return;

      const name = document.createElement("span");
      name.className = "student-name";
      name.textContent = " | Kwin Deike";
      logo.appendChild(name);
    });
  }

  function renderCart() {
    document.querySelectorAll(".header-top").forEach((headerTop) => {
      if (headerTop.querySelector(".cart-button")) return;

      const cartButton = document.createElement("button");
      cartButton.type = "button";
      cartButton.className = "cart-button";
      cartButton.setAttribute("aria-label", "Open shopping cart");
      cartButton.innerHTML = "<span aria-hidden=\"true\">🛒</span><span class=\"cart-count\">0</span>";
      headerTop.appendChild(cartButton);

      cartButton.addEventListener("click", () => {
        const panel = document.querySelector(".cart-panel");
        if (panel) panel.classList.toggle("open");
      });
    });

    if (!document.querySelector(".cart-panel")) {
      const panel = document.createElement("aside");
      panel.className = "cart-panel";
      panel.setAttribute("aria-label", "Shopping cart");
      panel.innerHTML = `
        <div class="cart-panel-header">
          <h2>Shopping Cart</h2>
          <button type="button" class="cart-close" aria-label="Close shopping cart">×</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-total"><strong>Total:</strong> <span>$0.00</span></div>
        <a class="cart-checkout" href="contact.html">Continue to Schedule</a>
      `;
      document.body.appendChild(panel);

      panel.querySelector(".cart-close").addEventListener("click", () => {
        panel.classList.remove("open");
      });
    }

    updateCartUI();
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("freshPressCart") || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("freshPressCart", JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count;
    });

    const itemsContainer = document.querySelector(".cart-items");
    const totalElement = document.querySelector(".cart-total span");
    if (!itemsContainer || !totalElement) return;

    totalElement.textContent = `$${total.toFixed(2)}`;

    if (!cart.length) {
      itemsContainer.innerHTML = "<p class=\"empty-cart\">Your cart is empty.</p>";
      return;
    }

    itemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button type="button" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
          <button type="button" data-action="remove" data-index="${index}" aria-label="Remove item">×</button>
        </div>
      </div>
    `).join("");
  }

  function initCartButtons() {
    document.querySelectorAll(".product-actions button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const card = button.closest(".product-card");
        if (!card) return;

        const heading = card.querySelector("h2");
        const priceElement = card.querySelector(".product-price");
        if (!heading || !priceElement) return;

        const name = heading.textContent.trim();
        const price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ""));
        const cart = getCart();
        const existing = cart.find((item) => item.name === name);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ name, price, quantity: 1 });
        }

        saveCart(cart);
        button.textContent = "Added! ✓";
        setTimeout(() => {
          button.textContent = "Add to cart";
        }, 1200);
      });
    });
  }

  function wireCartControls() {
    document.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control) return;

      const index = Number(control.dataset.index);
      const action = control.dataset.action;
      const cart = getCart();
      if (!cart[index]) return;

      if (action === "increase") cart[index].quantity += 1;
      if (action === "decrease") cart[index].quantity -= 1;
      if (action === "remove" || cart[index].quantity <= 0) cart.splice(index, 1);

      saveCart(cart);
    });
  }

  function renderSocialLinks() {
    document.querySelectorAll(".social-links").forEach((el) => {
      buildList(el, SOCIAL_LINKS);
    });
  }

  function wireMobileToggle() {
    const nav = document.querySelector(".primary-nav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function init() {
    renderPrimaryNav();
    renderStudentName();
    renderSocialLinks();
    renderCart();
    initCartButtons();
    wireCartControls();
    wireMobileToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();