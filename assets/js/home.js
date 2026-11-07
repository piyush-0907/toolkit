/* Homepage rendering. All content comes from data/tools.js. */
(() => {
  const { tools, categories, bySlug } = TOOLKIT;
  const fill = (id, html) => { document.getElementById(id).innerHTML = html; };

  // Popular tools: the eight named in the product brief
  const popular = ["pdf-compressor", "image-compressor", "qr-code-generator", "word-counter",
    "image-resizer", "json-formatter", "percentage-calculator", "pdf-merger"].map(bySlug);
  fill("popular-grid", popular.map(t => Cards.tool(t)).join(""));

  fill("category-grid", categories.map(c => Cards.category(c)).join(""));

  // Recently added: newest four
  const recent = tools.filter(t => t.added).sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);
  fill("new-grid", recent.map(t => Cards.tool(t)).join(""));

  // Recently used (from localStorage). The section stays hidden until there is something to show.
  const used = Store.recentTools().map(bySlug).filter(Boolean).slice(0, 4);
  if (used.length) {
    fill("used-grid", used.map(t => Cards.tool(t)).join(""));
    document.getElementById("used").hidden = false;
  }

  // Hero keywords
  fill("keywords", ["PDF", "Compress image", "QR code", "Word count", "JSON", "Password"]
    .map(k => `<a class="pill" href="tools/index.html?q=${encodeURIComponent(k)}">${k}</a>`).join(""));

  Search.init({ input: document.getElementById("hero-search"), list: document.getElementById("hero-list") });
})();
