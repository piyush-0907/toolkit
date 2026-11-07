/* Renders the shared header and footer. Set <body data-root=""> (or "../") so links work from any folder. */
(() => {
  const root = document.body.dataset.root || "";
  const { categories } = window.TOOLKIT;
  const here = document.body.dataset.page || "";
  const cur = p => (p === here ? ' aria-current="page"' : "");

  const catLinks = categories.map(c =>
    `<a class="dropdown__item" href="${root}categories/${c.slug}.html"><span data-icon="${c.icon}" data-size="18"></span>${c.name}</a>`).join("");

  document.getElementById("site-header").outerHTML = `
  <header class="header">
    <div class="container header__inner">
      <a class="brand" href="${root}index.html" aria-label="Toolkit home"><img src="${root}assets/img/logo.svg" alt="" width="28" height="28">Toolkit</a>
      <span class="header__spacer"></span>
      <nav class="nav" id="site-nav" aria-label="Main">
        <a class="nav__link" href="${root}index.html"${cur("home")}>Home</a>
        <a class="nav__link" href="${root}tools/index.html"${cur("tools")}>All Tools</a>
        <div class="dropdown">
          <button class="nav__link" type="button" aria-haspopup="true" aria-expanded="false">Categories <span data-icon="chevron" data-size="16"></span></button>
          <div class="dropdown__menu">${catLinks}</div>
        </div>
        <a class="nav__link" href="${root}tools/index.html?sort=popular">Popular Tools</a>
        <a class="nav__link" href="${root}about.html"${cur("about")}>About</a>
      </nav>
      <button class="btn btn--ghost btn--icon" type="button" data-theme-toggle aria-label="Toggle theme"></button>
      <button class="btn btn--ghost btn--icon menu-btn" type="button" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span data-icon="menu" data-size="20"></span></button>
    </div>
  </header>`;

  document.getElementById("site-footer").outerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div><a class="brand" href="${root}index.html"><img src="${root}assets/img/logo.svg" alt="" width="28" height="28">Toolkit</a>
          <p class="muted" style="margin-top:.75rem;max-width:34ch">Everything You Need. One Place. Free online tools for everyday tasks.</p></div>
        <nav aria-label="Company"><h2>Company</h2><ul>
          <li><a href="${root}about.html">About Us</a></li><li><a href="${root}contact.html">Contact Us</a></li>
          <li><a href="${root}privacy.html">Privacy Policy</a></li><li><a href="${root}terms.html">Terms of Service</a></li>
          <li><a href="${root}disclaimer.html">Disclaimer</a></li></ul></nav>
        <nav aria-label="All categories"><h2>All Categories</h2><ul>
          ${categories.map(c => `<li><a href="${root}categories/${c.slug}.html">${c.name}</a></li>`).join("")}</ul></nav>
      </div>
      <p class="footer__legal">&copy; ${new Date().getFullYear()} Toolkit. All rights reserved. Toolkit is a temporary brand name.</p>
    </div>
  </footer>`;

  const btn = document.getElementById("menu-btn"), nav = document.getElementById("site-nav");
  const setMenu = open => {
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.innerHTML = Icons.get(open ? "close" : "menu", 20);
  };
  btn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); btn.focus(); } });
})();
