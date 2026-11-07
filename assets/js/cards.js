/* Shared card markup. Reused by the homepage, directory and category pages. */
const Cards = (() => {
  const isNew = t => t.added && (Date.now() - new Date(t.added)) / 864e5 <= 30;
  const tool = (t, root = "") => `
    <a class="tool-card" href="${root}tool/${t.slug}.html">
      <div class="tool-card__top"><span class="icon-tile">${Icons.get(t.icon, 22)}</span>${isNew(t) ? '<span class="badge badge--new">New</span>' : ""}</div>
      <div><h3 class="tool-card__title">${t.name}</h3><p class="tool-card__desc">${t.desc}</p></div>
      <div class="tool-card__meta"><span>${t.categoryName}</span><span class="tool-card__open">Open tool</span></div>
    </a>`;
  const category = (c, root = "") => `
    <a class="cat-card" href="${root}categories/${c.slug}.html">
      <span class="icon-tile">${Icons.get(c.icon, 22)}</span>
      <div><h3>${c.name}</h3><p>${c.desc}</p><small>${c.count} tools</small></div>
    </a>`;
  return { tool, category, isNew };
})();
