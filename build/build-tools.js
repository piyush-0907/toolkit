/* Generates tool/<slug>.html for every tool from data/tools.js + build/tool-specs.js.
   Run from the project root:  node build/build-tools.js */
const { root, fs, path, Icons, Cards, esc, head, TOOLKIT } = require("./lib");
const specs = require("./tool-specs");
const { tools, categories } = TOOLKIT;

/* ---------- Workspace pieces ---------- */
const control = (f, id) => {
  const label = `<label class="field__label" for="${id}">${esc(f.label)}</label>`;
  const ph = f.ph ? ` placeholder="${esc(f.ph)}"` : "";
  switch (f.t) {
    case "select": return `<div class="field">${label}<select class="select" id="${id}">${f.opts.map(o => `<option>${esc(o)}</option>`).join("")}</select></div>`;
    case "textarea": return `<div class="field field--wide">${label}<textarea class="textarea" id="${id}"${ph}></textarea></div>`;
    case "checkbox": return `<label class="check"><input type="checkbox" id="${id}"${f.on ? " checked" : ""}><span>${esc(f.label)}</span></label>`;
    case "color": return `<div class="field">${label}<input class="input input--color" type="color" id="${id}" value="${f.val}"></div>`;
    case "number": return `<div class="field">${label}<input class="input" type="number" id="${id}" inputmode="decimal"${f.val !== "" && f.val !== undefined ? ` value="${f.val}"` : ""}${ph}></div>`;
    default: return `<div class="field">${label}<input class="input" type="${f.t}" id="${id}"${ph} autocomplete="off"></div>`;
  }
};
const controls = (list, prefix) => list.length ? `<div class="controls">${list.map((f, i) => control(f, `${prefix}${i}`)).join("")}</div>` : "";

const input = s => {
  if (s.mode === "file") return `
      <div class="dropzone" data-dropzone="#file-list" tabindex="0" role="button" aria-label="Choose files or drag them here">
        <span class="icon-tile">${Icons.get("upload", 22)}</span>
        <p class="dropzone__title">Drop ${s.multi ? "files" : "a file"} here or click to browse</p>
        <p class="dropzone__hint">${esc(s.hint)}</p>
        <input type="file" class="sr-only" accept="${s.accept}"${s.multi ? " multiple" : ""} tabindex="-1" aria-hidden="true">
      </div>
      <div class="stack" id="file-list" aria-live="polite"></div>`;
  if (s.mode === "text") return `
      <div class="field"><label class="field__label" for="main-input">${esc(s.inLabel)}</label>
        <textarea class="textarea textarea--lg" id="main-input" placeholder="${esc(s.ph)}"></textarea></div>`;
  if (s.mode === "text2") return `
      <div class="pair">${s.labels.map((l, i) => `<div class="field"><label class="field__label" for="main-input${i}">${l}</label><textarea class="textarea textarea--lg" id="main-input${i}"></textarea></div>`).join("")}</div>`;
  return "";
};

const result = s => {
  const body = s.outKind === "text"
    ? `<textarea class="textarea" id="result-text" readonly placeholder="Your ${esc(s.out.toLowerCase())} will appear here."></textarea>`
    : s.outKind === "stats"
      ? `<dl class="stats" id="result-text">${(s.stats || ["Result"]).map(k => `<div><dt>${esc(k)}</dt><dd>&mdash;</dd></div>`).join("")}</dl>`
      : `<div class="result__empty" id="result-text">Your ${esc(s.out.toLowerCase())} will appear here.</div>`;
  return `
      <div class="result" aria-live="polite">
        <div class="result__head"><h2>${esc(s.out)}</h2>
          <div class="row" style="gap:.5rem">
            <button class="btn btn--secondary" type="button" disabled data-copy="#result-text">${Icons.get("copy", 16)}Copy</button>
            <button class="btn btn--secondary" type="button" disabled>${Icons.get("download", 16)}Download</button>
          </div></div>
        ${body}
        <p class="result__note"><span class="badge badge--demo">Preview</span> No result is produced yet. Processing isn't connected.</p>
      </div>`;
};

/* ---------- Content blocks ---------- */
const steps = (t, s) => ({
  file: [`Add ${s.multi ? "your files" : "your file"} by dragging ${s.multi ? "them" : "it"} into the upload area or choosing from your device.`, "Review the settings and change anything you need.", `Select “${s.action}”.`, "Copy or download the result when it is ready."],
  text: ["Paste or type your content into the input box.", "Choose your options, if any.", `Select “${s.action}”.`, "Copy or download the result."],
  text2: ["Paste the first version into the left box and the second into the right.", "Choose your options, if any.", `Select “${s.action}”.`, "Review the differences in the result area."],
  fields: ["Fill in the fields below with your values.", "Check the options and change anything you need.", `Select “${s.action}”.`, "Copy or download the result."]
}[s.mode]);

const features = s => [
  ["Free to use", "No account and no payment needed."],
  ["Simple settings", "Sensible defaults with the options you actually need."],
  ["Works on any device", "A layout that fits phones, tablets and desktops."],
  ["Built for privacy", s.mode === "file" ? "Designed to work in your browser so files can stay on your device." : "Designed to work in your browser so your input can stay on your device."]
];

const faqs = (t, s) => [
  [`What does the ${t.name} do?`, t.desc],
  [`Is the ${t.name} free?`, "Yes. You can use it without paying or creating an account."],
  [s.mode === "file" ? "Are my files uploaded to a server?" : "Is my data stored?",
   "Toolkit tools are designed to run in your browser, so your content can stay on your device. This page is currently an interface preview and does not process anything."],
  ["Does it work on my phone?", "Yes. The page is designed for phones, tablets and computers."]
];

/* ---------- Page ---------- */
const page = t => {
  const s = specs[t.slug];
  const cat = categories.find(c => c.slug === t.category);
  const title = `${t.name} | Free Online Tool | Toolkit`;
  const desc = `${t.desc} Free, fast and no sign-up needed.`;
  const f = faqs(t, s);
  const same = tools.filter(x => x.category === t.category && x.slug !== t.slug).sort((a, b) => b.popularity - a.popularity);
  const fill = tools.filter(x => x.category !== t.category).sort((a, b) => b.popularity - a.popularity);
  const rel = [...same, ...fill].slice(0, 4);

  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebApplication", name: t.name, description: t.desc, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@type": "BreadcrumbList", itemListElement: [["Home", "../index.html"], [cat.name, `../categories/${cat.slug}.html`], [t.name, `${t.slug}.html`]].map(([name, item], i) => ({ "@type": "ListItem", position: i + 1, name, item })) },
    { "@type": "FAQPage", mainEntity: f.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ] };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head({ title, desc, ld })}
</head>
<body data-root="../" data-page="tool" data-tool="${t.slug}" data-mode="${s.mode}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header id="site-header"></header>

  <main id="main">
    <div class="container tool-page">
      <div class="page-head" style="padding-inline:0">
        <nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="../index.html">Home</a></li><li><a href="../categories/${cat.slug}.html">${esc(cat.name)}</a></li><li aria-current="page">${esc(t.name)}</li></ol></nav>
        <div class="row" style="gap:1rem;align-items:flex-start;flex-wrap:nowrap"><span class="icon-tile" style="width:48px;height:48px">${Icons.get(t.icon, 26)}</span>
          <div><h1>${esc(t.name)}</h1><p>${esc(t.desc)}</p></div></div>
      </div>

      <div class="notice"><span>${Icons.get("info", 18)}</span><p>Interface preview. This tool doesn't process anything yet, and the result area stays empty.</p></div>

      <section class="workspace" aria-label="${esc(t.name)} workspace">${input(s)}
        ${controls(s.settings, "s")}
        <div class="row"><button class="btn btn--primary btn--lg" type="button" id="run-btn">${esc(s.action)}</button><button class="btn btn--ghost" type="button" id="reset-btn">Reset</button></div>${result(s)}
      </section>

      <div class="content-grid">
        <section aria-labelledby="how-title"><h2 id="how-title">How to use the ${esc(t.name)}</h2>
          <ol class="steps">${steps(t, s).map(x => `<li>${esc(x)}</li>`).join("")}</ol></section>
        <section aria-labelledby="feat-title"><h2 id="feat-title">Features and benefits</h2>
          <ul class="features">${features(s).map(([h, p]) => `<li><span class="features__icon">${Icons.get("check", 16)}</span><div><h3>${h}</h3><p>${esc(p)}</p></div></li>`).join("")}</ul></section>
      </div>

      <section class="faq-block" aria-labelledby="faq-title"><h2 id="faq-title">Frequently asked questions</h2>
        <div class="accordion">${f.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><div class="accordion__body">${esc(a)}</div></details>`).join("")}</div></section>

      <section aria-labelledby="rel-title" style="padding-bottom:var(--sp-8)"><h2 id="rel-title" style="margin-bottom:var(--sp-4)">Related tools</h2>
        <div class="grid">${rel.map(x => Cards.tool(x, "../")).join("")}</div></section>
    </div>
  </main>

  <footer id="site-footer"></footer>

  <script src="../assets/js/icons.js"></script>
  <script src="../assets/js/data/tools.js"></script>
  <script src="../assets/js/storage.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/ui.js"></script>
  <script src="../assets/js/tool.js"></script>
</body>
</html>
`;
};

fs.mkdirSync(path.join(root, "tool"), { recursive: true });
tools.forEach(t => fs.writeFileSync(path.join(root, "tool", t.slug + ".html"), page(t)));
console.log(`Built ${tools.length} tool pages`);
