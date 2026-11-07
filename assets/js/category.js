/* Category page: re-renders the prerendered grid from data so badges stay current. */
(() => {
  const slug = document.body.dataset.category;
  document.getElementById("cat-grid").innerHTML = TOOLKIT.byCategory(slug).map(t => Cards.tool(t, "../")).join("");
})();
