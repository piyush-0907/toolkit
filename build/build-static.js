/* Generates About, Contact, legal pages, 404, sitemap.xml and robots.txt.
   Run from the project root:  node build/build-static.js
   Set SITE_URL to your real domain before launch. */
const { root, fs, path, esc, head, TOOLKIT } = require("./lib");
const { tools, categories } = TOOLKIT;
const SITE_URL = "https://www.example.com";

const DRAFT = `<div class="notice"><span data-icon="info" data-size="18"></span><p>Template text for the preview. Replace it with wording reviewed by a qualified professional, and add your company name, address and jurisdiction, before launch.</p></div>`;

const pages = [
  { file: "about.html", page: "about", title: "About Toolkit", desc: "Toolkit is a collection of free, simple online tools for everyday tasks. Learn what we believe and how we build.",
    h1: "About Toolkit", lead: "Free, simple tools for everyday tasks, all in one place.",
    body: `<h2>What we're building</h2><p>Toolkit brings together 50 online tools for PDFs, images, QR codes, calculations, text, development and design. Each tool does one job, opens instantly and asks for nothing before you start.</p>
<h2>What we care about</h2><ul><li><strong>Simple.</strong> One task per page, clear controls, no clutter.</li><li><strong>Private.</strong> Tools are designed to run in your browser so your content can stay on your device.</li><li><strong>Accessible.</strong> Keyboard-friendly, readable in light and dark, and usable on a phone.</li><li><strong>Honest.</strong> We say plainly what a tool does and what it doesn't.</li></ul>
<h2>Where things stand</h2><p>This site is a preview of the interface. The tools are not connected yet, and each page says so.</p>` },
  { file: "contact.html", page: "contact", title: "Contact Us | Toolkit", desc: "Send feedback, report a problem or suggest a new tool.",
    h1: "Contact us", lead: "Report a problem, share feedback or suggest a tool.", form: true },
  { file: "privacy.html", page: "privacy", title: "Privacy Policy | Toolkit", desc: "How Toolkit handles information, browser storage and third-party services.",
    h1: "Privacy Policy", lead: "Last updated: [date]", draft: true,
    body: `<h2>Summary</h2><p>Toolkit is designed so that the content you use with a tool can stay in your browser. You don't need an account to use the site.</p>
<h2>Information stored in your browser</h2><p>To make the site more convenient, it saves a few preferences in your browser's local storage on your device:</p><ul><li>Your light or dark theme choice.</li><li>Tools you recently opened.</li><li>Your recent searches.</li></ul><p>You can remove this data at any time by clearing your browser's site data. It is not sent to us.</p>
<h2>Information we collect</h2><p>[Describe any analytics, advertising, cookies, server logs or contact-form handling you add. List each provider and what it receives.]</p>
<h2>Your choices and rights</h2><p>[Describe how people can ask about, correct or delete their data, including rights that apply in the U.S. states and countries you serve.]</p>
<h2>Contact</h2><p>Questions about this policy? Use the <a href="contact.html">Contact page</a>.</p>` },
  { file: "terms.html", page: "terms", title: "Terms of Service | Toolkit", desc: "The terms for using Toolkit's online tools.",
    h1: "Terms of Service", lead: "Last updated: [date]", draft: true,
    body: `<h2>Using the site</h2><p>You may use Toolkit for lawful purposes. Don't misuse the site, interfere with it, or try to access it in ways we haven't provided.</p>
<h2>Your content</h2><p>You are responsible for the files and text you use with the tools and for having the right to use them.</p>
<h2>No warranty</h2><p>The tools are provided "as is" and "as available". Check important results before relying on them.</p>
<h2>Limitation of liability</h2><p>[Add liability wording suited to your business and jurisdiction.]</p>
<h2>Changes</h2><p>We may update these terms. The date at the top shows the latest version.</p>
<h2>Governing law</h2><p>[Add your governing law and venue.]</p>` },
  { file: "disclaimer.html", page: "disclaimer", title: "Disclaimer | Toolkit", desc: "Important notes about the accuracy and use of results from Toolkit's tools.",
    h1: "Disclaimer", lead: "Last updated: [date]", draft: true,
    body: `<h2>General information</h2><p>Toolkit's tools are provided for general information and convenience. Results may contain errors.</p>
<h2>Calculators</h2><p>Calculator results, such as loan, BMI and percentage figures, are estimates. They are not financial, medical or professional advice. Consult a qualified professional for decisions that matter.</p>
<h2>Files and data</h2><p>Keep a copy of your original files. We are not responsible for loss or damage resulting from use of the tools.</p>
<h2>External links</h2><p>We aren't responsible for the content of other websites we link to.</p>` }
];

const shell = ({ page, title, desc, r, content, scripts }) => `<!DOCTYPE html>
<html lang="en">
<head>
  ${head({ title, desc, r })}
</head>
<body data-root="${r === "/" ? "/" : ""}" data-page="${page}">
  <a class="skip-link" href="#main">Skip to content</a>
  <header id="site-header"></header>
${content}
  <footer id="site-footer"></footer>

  <script src="${r === "/" ? "/" : ""}assets/js/icons.js"></script>
  <script src="${r === "/" ? "/" : ""}assets/js/data/tools.js"></script>
  <script src="${r === "/" ? "/" : ""}assets/js/storage.js"></script>
  <script src="${r === "/" ? "/" : ""}assets/js/layout.js"></script>
${scripts}
</body>
</html>
`;
const script = (f, r) => `  <script src="${r === "/" ? "/" : ""}assets/js/${f}"></script>`;

const form = `<form class="contact-form" id="contact-form">
        <div class="field"><label class="field__label" for="c-name">Name</label><input class="input" id="c-name" name="name" required autocomplete="name"></div>
        <div class="field"><label class="field__label" for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label class="field__label" for="c-topic">Topic</label><select class="select" id="c-topic" name="topic"><option>Feedback</option><option>Report a problem</option><option>Suggest a tool</option><option>Other</option></select></div>
        <div class="field"><label class="field__label" for="c-msg">Message</label><textarea class="textarea" id="c-msg" name="message" required style="font-family:var(--font-sans);font-size:var(--text-base)"></textarea></div>
        <div><button class="btn btn--primary btn--lg" type="submit">Send message</button></div>
      </form>`;

pages.forEach(p => {
  const content = `
  <main id="main">
    <div class="container" style="padding-bottom:var(--sp-8)">
      <div class="page-head" style="padding-inline:0">
        <nav aria-label="Breadcrumb"><ol class="breadcrumb"><li><a href="index.html">Home</a></li><li aria-current="page">${esc(p.h1)}</li></ol></nav>
        <h1>${esc(p.h1)}</h1><p>${esc(p.lead)}</p>
      </div>
      ${p.draft ? DRAFT : ""}${p.form ? `<div class="notice"><span data-icon="info" data-size="18"></span><p>Interface preview. This form doesn't send messages yet.</p></div><div style="margin-top:var(--sp-5)">${form}</div>` : `<div class="prose" style="margin-top:var(--sp-5)">${p.body}</div>`}
    </div>
  </main>
`;
  const scripts = script("ui.js", "") + (p.form ? "\n" + script("contact.js", "") : "");
  fs.writeFileSync(path.join(root, p.file), shell({ page: p.page, title: p.title, desc: p.desc, r: "", content, scripts }));
});

/* 404: root-relative paths so it works at any depth */
const nf = `
  <main id="main">
    <div class="container notfound">
      <span class="badge">Error 404</span>
      <h1>This page doesn't exist</h1>
      <p class="muted" style="max-width:46ch">The link may be broken or the page may have moved. Search for the tool you need, or browse them all.</p>
      <div class="search">
        <div class="search__box"><span data-icon="search"></span>
          <input class="search__input" id="nf-search" type="search" placeholder="Search 50 tools" aria-label="Search tools" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="nf-list"></div>
        <ul class="search__list" id="nf-list" role="listbox" aria-label="Search suggestions" hidden></ul>
      </div>
      <a class="btn btn--primary" href="/tools/index.html">Browse all tools</a>
    </div>
  </main>
`;
fs.writeFileSync(path.join(root, "404.html"), shell({ page: "404", title: "Page not found | Toolkit", desc: "The page you were looking for could not be found.", r: "/", content: nf,
  scripts: script("cards.js", "/") + "\n" + script("search.js", "/") + "\n" + script("ui.js", "/") + "\n" + script("notfound.js", "/") }));

/* Sitemap + robots */
const urls = ["", "tools/index.html", ...categories.map(c => `categories/${c.slug}.html`), ...tools.map(t => `tool/${t.slug}.html`),
  "about.html", "contact.html", "privacy.html", "terms.html", "disclaimer.html"];
fs.writeFileSync(path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE_URL}/${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`Built ${pages.length} content pages, 404, sitemap (${urls.length} URLs), robots.txt`);
