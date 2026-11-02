/* Shared helpers for build scripts: loads the same data and renderers the browser uses. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, "assets/js", f), "utf8");
global.window = global;
vm.runInThisContext(read("data/tools.js"));
const Icons = vm.runInThisContext(read("icons.js") + ";Icons");
const Cards = vm.runInThisContext(read("cards.js") + ";Cards");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
// Shared <head> block so every generated page stays consistent
const head = ({ title, desc, ld, r = "../" }) => `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="website">
  <link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${r}assets/css/tokens.css">
  <link rel="stylesheet" href="${r}assets/css/base.css">
  <link rel="stylesheet" href="${r}assets/css/components.css">
  <link rel="stylesheet" href="${r}assets/css/pages.css">
  <script>try{var t=localStorage.getItem("toolkit:theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
  ${ld ? `
  <script type="application/ld+json">${JSON.stringify(ld)}</script>` : ""}`;
module.exports = { root, fs, path, Icons, Cards, esc, head, TOOLKIT: window.TOOLKIT };
