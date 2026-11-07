/* Icon set: 24x24 stroke icons. Usage: Icons.get("search", 20) */
const Icons = (() => {
  const paths = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    file: '<path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7z"/><path d="M14 3v4h4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m21 16-5-5-8 8"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2M14 20h2"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    text: '<path d="M5 6V5h14v1M12 5v14M9 19h6"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.800 0-1-.8-1.500-.8-2.400 0-.9.700-1.600 1.700-1.600H17a4 4 0 0 0 4-4C21 6.500 17 3 12 3z"/><circle cx="7.500" cy="11" r=".8"/><circle cx="11" cy="7.500" r=".8"/><circle cx="16" cy="8.500" r=".8"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.500"/><rect x="13" y="4" width="7" height="7" rx="1.500"/><rect x="4" y="13" width="7" height="7" rx="1.500"/><rect x="13" y="13" width="7" height="7" rx="1.500"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
    download: '<path d="M12 4v12m0 0 5-5m-5 5-5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
    check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    zap: '<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.500 3 8 7 10 4-2 7-5.500 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18v-3H3zM12 6v14M12 6c-2 0-4-1-3-2.500S12 4 12 6zm0 0c2 0 4-1 3-2.500S12 4 12 6z"/>',
    hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.500 8 11 9M8.500 16l11-9"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.01M15 15h.01M12 12h.01M9 15h.01M15 9h.01"/>',
    barcode: '<path d="M4 5v14M7 5v14M11 5v14M14 5v14M18 5v14M20 5v14"/>',
    swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4m4 4H7"/>'
  };
  const get = (name, size = 20) =>
    `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.grid}</svg>`;
  // Replace <i data-icon="name" data-size="20"> placeholders with inline SVG
  const hydrate = (root = document) =>
    root.querySelectorAll("[data-icon]").forEach(el => {
      el.innerHTML = get(el.dataset.icon, +el.dataset.size || 20);
      el.removeAttribute("data-icon");
    });
  return { get, hydrate };
})();
