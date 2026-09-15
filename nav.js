/* ============================================================================
   nav.js — shared navigation, student name, and shopping cart
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

  const CART_KEY = "freshPressCart";

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
      name.textContent = "Kwin Deike";
      name.style.fontSize = "28px";
      name.style.fontWeight = "700";
      name.style.color = "#fff";
      name.style.textShadow = "2px 2px 4px rgba(0,0,0,.2)";
      logo.appendChild(name);
    });
  }

  function injectCartStyles() {
    if (document.getElementById("shared-cart-styles")) return;

    const style = document.createElement("style");
    style.id = "shared-cart-styles";
    style.textContent = `
      .cart-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-width: 52px;
        height: 44px;
        padding: 0 12px;
        margin-left: 18px;
        border: 2px solid #fff;
        border-radius: 10px;
        background: rgba(255,255,255,.18);
        color: #fff;
        font-size: 22px;
        cursor: pointer;
        transition: all .25s ease;
        box-shadow: 0 3px 10px rgba(0,0,0,.12);
      }
      .cart-button:hover {
        background: #fff;
        color: #c71585;
        transform: translateY(-2px);
        box-shadow: 0 5px 14px rgba(0,0,0,.18);
      }
      .cart-count {
        min-width: 20px;
        height: 20px;
        padding: 1px 5px;
        border-radius: 999px;
        background: #8b0000;
        color: #fff;
        font-size: 12px;
        line-height: 18px;
        font-weight: 700;
      }
      .cart-panel {
        position: fixed;
        top: 0;
        right: -420px;
        width: min(400px, 92vw);
        height: 100vh;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        background: #fff;
        box-shadow: -8px 0 30px rgba(0,0,0,.22);
        transition: right .3s ease;
        border-left: 4px solid #ff69b4;
      }
      .cart-panel.open { right: 0; }
      .cart-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
        color: #fff;
      }
      .cart-panel-header h2 { margin: 0; font-size: 22px; }
      .cart-close {
        border: 0;
        background: transparent;
        color: #fff;
        font-size: 30px;
        line-height: 1;
        cursor: pointer;
      }
      .cart-close:hover { transform: scale(1.15); }
      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 18px;
      }
      .empty-cart { text-align: center; color: #777; padding: 35px 10px; }
      .cart-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        padding: 15px 0;
        border-bottom: 1px solid #ffd0e1;
      }
      .cart-item strong { display: block; color: #c71585; }
      .cart-item p { margin: 4px 0 0; color: #777; font-size: 13px; }
      .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 7px;
        flex-shrink: 0;
      }
      .cart-item-controls button {
        width: 28px;
        height: 28px;
        border: 1px solid #ff69b4;
        border-radius: 5px;
        background: #fff;
        color: #c71585;
        font-size: 18px;
        cursor: pointer;
      }
      .cart-item-controls button:hover { background: #ffe6f0; }
      .cart-total {
        display: flex;
        justify-content: space-between;
        padding: 18px 20px;
        border-top: 2px solid #ffb6c1;
        font-size: 18px;
        color: #c71585;
      }
      .cart-checkout {
        display: block;
        margin: 0 20px 20px;
        padding: 13px;
        border-radius: 8px;
        background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
        color: #fff;
        text-align: center;
        text-decoration: none;
        font-weight: 700;
        transition: all .25s ease;
      }
      .cart-checkout:hover {
        background: linear-gradient(135deg, #c71585 0%, #8b0000 100%);
        transform: translateY(-2px);
      }
      @media (max-width: 700px) {
        .cart-button { margin-left: 8px; }
        .cart-panel { width: 92vw; }
      }
    `;
    document.head.appendChild(style);
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
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
      itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
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

  function renderCart() {
    injectCartStyles();

    document.querySelectorAll(".header-top").forEach((headerTop) => {
      if (headerTop.querySelector(".cart-button")) return;

      const cartButton = document.createElement("button");
      cartButton.type = "button";
      cartButton.className = "cart-button";
      cartButton.setAttribute("aria-label", "Open shopping cart");
      cartButton.innerHTML = '<span aria-hidden="true">🛒</span><span class="cart-count">0</span>';
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
        <div class="cart-total"><strong>Total:</strong><span>$0.00</span></div>
        <a class="cart-checkout" href="contact.html">Continue to Schedule</a>
      `;
      document.body.appendChild(panel);

      panel.querySelector(".cart-close").addEventListener("click", () => {
        panel.classList.remove("open");
      });
    }

    updateCartUI();
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

        if (existing) existing.quantity += 1;
        else cart.push({ name, price, quantity: 1 });

        saveCart(cart);
        button.textContent = "Added! ✓";
        setTimeout(() => { button.textContent = "Add to cart"; }, 1200);
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
