/* All Tools directory: live search, category filter, sorting. State lives in the URL (?q=&cat=&sort=). */
(() => {
  const { tools, categories } = TOOLKIT;
  const root = "../";
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const SORTS = ["category", "az", "popular"];
  const state = {
    q: params.get("q") || "",
    cat: categories.some(c => c.slug === params.get("cat")) ? params.get("cat") : "all",
    sort: SORTS.includes(params.get("sort")) ? params.get("sort") : "category"
  };

  // Build filter pills once
  $("filters").innerHTML =
    [{ slug: "all", name: "All" }, ...categories].map(c =>
      `<button class="pill" type="button" data-cat="${c.slug}" aria-pressed="false">${c.name}</button>`).join("");

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.sort !== "category") p.set("sort", state.sort);
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
  };

  const grid = list => `<div class="grid">${list.map(t => Cards.tool(t, root)).join("")}</div>`;

  function render() {
    // Filter
    let list = state.q ? Search.match(state.q) : [...tools];
    if (state.cat !== "all") list = list.filter(t => t.category === state.cat);

    // Sync controls
    $("dir-search").value = state.q;
    $("dir-sort").value = state.sort;
    document.querySelectorAll("[data-cat]").forEach(b => b.setAttribute("aria-pressed", b.dataset.cat === state.cat));

    // Result count (announced to screen readers)
    const total = list.length;
    $("results-meta").textContent = total
      ? `Showing ${total} of ${tools.length} tools` + (state.q ? ` for “${state.q}”` : "")
      : "";

    const out = $("results");
    if (!total) {
      out.innerHTML = `<div class="empty">
        <span class="icon-tile">${Icons.get("search", 22)}</span>
        <h2>No tools found</h2>
        <p>${state.q ? `Nothing matches “${state.q.replace(/[<>&"]/g, "")}”` : "No tools in this category"}. Check the spelling, try a broader word like “image”, or clear your filters.</p>
        <button class="btn btn--secondary" type="button" id="clear-filters">Clear search and filters</button></div>`;
    } else if (state.sort === "category") {
      out.innerHTML = categories.map(c => {
        const items = list.filter(t => t.category === c.slug);
        return items.length ? `<section class="group" aria-labelledby="g-${c.slug}">
          <div class="group__head"><h2 id="g-${c.slug}">${c.name}</h2><span>${items.length} ${items.length === 1 ? "tool" : "tools"}</span></div>${grid(items)}</section>` : "";
      }).join("");
    } else {
      const sorted = [...list].sort(state.sort === "az"
        ? (a, b) => a.name.localeCompare(b.name)
        : (a, b) => b.popularity - a.popularity);
      out.innerHTML = grid(sorted);
    }
    syncUrl();
  }

  // Events
  $("dir-search").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
  $("dir-search").addEventListener("keydown", e => { if (e.key === "Enter") Store.addSearch(state.q); });
  $("dir-sort").addEventListener("change", e => { state.sort = e.target.value; render(); });
  $("filters").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]");
    if (b) { state.cat = b.dataset.cat; render(); }
  });
  $("results").addEventListener("click", e => {
    if (e.target.closest("#clear-filters")) { state.q = ""; state.cat = "all"; state.sort = "category"; render(); $("dir-search").focus(); }
  });

  render();
})();
