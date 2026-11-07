/* Live search with suggestions and saved history.
   Search.init({ input, list, root }) */
const Search = (() => {
  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const match = q => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return TOOLKIT.tools
      .map(t => {
        const hay = (t.name + " " + t.categoryName + " " + t.desc).toLowerCase();
        if (!words.every(w => hay.includes(w))) return null;
        const score = (t.name.toLowerCase().startsWith(words[0]) ? 100 : 0) + (t.name.toLowerCase().includes(q.toLowerCase()) ? 50 : 0) + t.popularity / 10;
        return { t, score };
      })
      .filter(Boolean).sort((a, b) => b.score - a.score).map(x => x.t);
  };

  function init({ input, list, root = "" }) {
    let items = [], active = -1;
    const open = o => { list.hidden = !o; input.setAttribute("aria-expanded", o); if (!o) { active = -1; input.removeAttribute("aria-activedescendant"); } };
    const setActive = i => {
      const els = [...list.querySelectorAll("[role=option]")];
      if (!els.length) return;
      active = (i + els.length) % els.length;
      els.forEach((e, n) => e.setAttribute("aria-selected", n === active));
      input.setAttribute("aria-activedescendant", els[active].id);
    };
    const toolLink = t => `${root}tool/${t.slug}.html`;
    const allResults = q => `${root}tools/index.html?q=${encodeURIComponent(q)}`;

    function render() {
      const q = input.value.trim();
      if (!q) {
        const h = Store.searches();
        items = [];
        list.innerHTML = h.length
          ? `<li class="search__heading" role="presentation"><span>Recent searches</span><button type="button" data-clear>Clear</button></li>` +
            h.map((s, i) => `<li class="search__item" role="option" id="sg-${i}" aria-selected="false" data-q="${esc(s)}"><span data-icon="clock" data-size="18"></span>${esc(s)}</li>`).join("")
          : `<li class="search__empty" role="presentation">Try “PDF”, “QR code” or “JSON”.</li>`;
        Icons.hydrate(list);
        return open(true);
      }
      items = match(q).slice(0, 6);
      list.innerHTML = items.length
        ? items.map((t, i) => `<li class="search__item" role="option" id="sg-${i}" aria-selected="false" data-slug="${t.slug}"><span class="icon-tile" style="width:32px;height:32px">${Icons.get(t.icon, 16)}</span>${esc(t.name)}<small>${esc(t.categoryName)}</small></li>`).join("")
        : `<li class="search__empty" role="presentation">No tools match “${esc(q)}”. Check the spelling or try a broader word like “image”.</li>`;
      open(true);
      if (items.length) setActive(0);
    }

    const go = el => {
      if (!el) return;
      if (el.dataset.slug) { Store.addSearch(input.value); location.href = toolLink(TOOLKIT.bySlug(el.dataset.slug)); }
      else if (el.dataset.q) { input.value = el.dataset.q; location.href = allResults(el.dataset.q); }
    };

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
      else if (e.key === "Escape") { open(false); input.blur(); }
      else if (e.key === "Enter") {
        e.preventDefault();
        const sel = list.querySelectorAll("[role=option]")[active];
        if (sel) return go(sel);
        const q = input.value.trim();
        if (q) { Store.addSearch(q); location.href = allResults(q); }
      }
    });
    list.addEventListener("mousedown", e => e.preventDefault());
    list.addEventListener("click", e => {
      if (e.target.closest("[data-clear]")) { Store.clearSearches(); return render(); }
      go(e.target.closest("[role=option]"));
    });
    document.addEventListener("click", e => { if (!e.target.closest(".search")) open(false); });
    document.addEventListener("keydown", e => {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
    });
  }
  return { init, match };
})();
