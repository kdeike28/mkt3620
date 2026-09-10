(function () {
  "use strict";

  const NAV_LINKS = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Products", href: "products.html" },
    { label: "Services", href: "services.html" },
    { label: "Blog", href: "blog.html" },
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
    renderSocialLinks();
    wireMobileToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
