/* localStorage helpers: recently used tools and search history. Safe if storage is blocked. */
const Store = (() => {
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem("toolkit:" + k)) ?? d; } catch { return d; } };
  const set = (k, v) => { try { localStorage.setItem("toolkit:" + k, JSON.stringify(v)); } catch {} };
  const pushUnique = (k, v, max) => set(k, [v, ...get(k, []).filter(x => x !== v)].slice(0, max));
  return {
    recentTools: () => get("recent", []),
    addRecentTool: slug => pushUnique("recent", slug, 8),
    searches: () => get("searches", []),
    addSearch: q => q.trim() && pushUnique("searches", q.trim(), 6),
    clearSearches: () => set("searches", [])
  };
})();
