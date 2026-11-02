/* Generates categories/<slug>.html from data/tools.js.
   Run from the project root:  node build/build-pages.js
   Output is prerendered so each page has its own title, description and crawlable tool links. */
const { root, fs, path, Icons, Cards, TOOLKIT } = require("./lib");
const { categories, byCategory } = TOOLKIT;

const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const page = c => {
  const list = byCategory(c.slug);
  const others = categories.filter(x => x.slug !== c.slug);
  const title = `${c.name} | Free Online Tools | Toolkit`;
  const first = c.intro.split(". ")[0].replace(/\.$/, "") + ".";
  let desc = `${list.length} free ${c.name} online. ${first}`;
  if (desc.length > 158) desc = desc.slice(0, 155).replace(/\s+\S*$/, "") + "...";
  const ld = { "@context": "https://schema.org", "@type": "CollectionPage", name: c.name, description: c.intro,
    mainEntity: { "@type": "ItemList", itemListElement: list.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `tool/${t.slug}.html` })) } };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/components.css">
  <link rel="stylesheet" href="../assets/css/pages.css">
  <script>try{var t=localStorage.getItem("toolkit:theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body data-root="../" data-page="category" data-category="${c.slug}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header id="site-header"></header>

  <main id="main">
    <div class="container page-head">
      <nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="../index.html">Home</a></li><li><a href="../tools/index.html">All Tools</a></li><li aria-current="page">${esc(c.name)}</li></ol></nav>
      <div class="row" style="gap:1rem;align-items:flex-start;flex-wrap:nowrap"><span class="icon-tile" style="width:48px;height:48px">${Icons.get(c.icon, 26)}</span>
        <div><h1>${esc(c.name)}</h1><p>${c.intro}</p></div></div>
    </div>

    <section class="container" aria-labelledby="tools-title" style="padding-bottom:var(--sp-7)">
      <h2 id="tools-title" class="group__head" style="margin-bottom:var(--sp-4)">${list.length} tools <span>Free to use</span></h2>
      <div class="grid" id="cat-grid">${list.map(t => Cards.tool(t, "../")).join("")}</div>
    </section>

    <section class="section section--subtle" aria-labelledby="more-title">
      <div class="container">
        <div class="section__head"><h2 id="more-title">Other categories</h2></div>
        <div class="grid">${others.map(o => Cards.category(o, "../")).join("")}</div>
      </div>
    </section>
  </main>

  <footer id="site-footer"></footer>

  <script src="../assets/js/icons.js"></script>
  <script src="../assets/js/data/tools.js"></script>
  <script src="../assets/js/storage.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/cards.js"></script>
  <script src="../assets/js/ui.js"></script>
  <script src="../assets/js/category.js"></script>
</body>
</html>
`;
};

fs.mkdirSync(path.join(root, "categories"), { recursive: true });
categories.forEach(c => fs.writeFileSync(path.join(root, "categories", c.slug + ".html"), page(c)));
console.log(`Built ${categories.length} category pages`);
