// nav.js
// Reusable top navigation bar for all pages on the site.
// Include this file on every page and add <div id="site-nav"></div> where you want it to appear.

document.addEventListener("DOMContentLoaded", function () {
  const navItems = [
    { label: "About Me", href: "index.html" },
    { label: "Research", href: "research.html" },
    { label: "Teaching", href: "teaching.html" },
    { label: "Personal", href: "personal.html" }
  ];

  const nav = document.createElement("nav");
  nav.className = "site-nav";

  const list = document.createElement("ul");
  list.className = "site-nav-list";

  navItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;

    // Highlight the current page
    if (window.location.pathname.endsWith(item.href)) {
      a.classList.add("active");
    }

    li.appendChild(a);
    list.appendChild(li);
  });

  nav.appendChild(list);

  const navContainer = document.getElementById("site-nav");
  if (navContainer) {
    navContainer.appendChild(nav);
  } else {
    // Fallback: insert at the very top of the body
    document.body.insertBefore(nav, document.body.firstChild);
  }
});
