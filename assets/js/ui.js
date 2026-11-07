/* Shared UI behaviour: theme, toast, dropdown, tabs, copy, dropzone */
const UI = (() => {
  /* ---- Theme: saved choice wins, otherwise follow the OS ---- */
  const KEY = "toolkit:theme";
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
  const applyTheme = t => document.documentElement.setAttribute("data-theme", t);
  applyTheme(read() || (systemDark() ? "dark" : "light"));

  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
      const sync = () => {
        const dark = document.documentElement.dataset.theme === "dark";
        btn.innerHTML = Icons.get(dark ? "sun" : "moon", 18);
        btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      };
      sync();
      btn.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(KEY, next); } catch {}
        sync();
      });
    });
  }

  /* ---- Toast ---- */
  function toast(message, ms = 2800) {
    let host = document.querySelector(".toasts");
    if (!host) {
      host = document.createElement("div");
      host.className = "toasts";
      host.setAttribute("role", "status");
      host.setAttribute("aria-live", "polite");
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => { el.classList.add("is-leaving"); setTimeout(() => el.remove(), 250); }, ms);
  }

  /* ---- Dropdown: <div class="dropdown"><button aria-expanded> + .dropdown__menu ---- */
  function initDropdowns() {
    document.querySelectorAll(".dropdown").forEach(dd => {
      const trigger = dd.querySelector("[aria-haspopup]");
      const items = () => [...dd.querySelectorAll(".dropdown__item")];
      const set = open => { dd.classList.toggle("is-open", open); trigger.setAttribute("aria-expanded", open); };
      trigger.addEventListener("click", e => { e.stopPropagation(); set(!dd.classList.contains("is-open")); });
      // Keyboard: Down opens and focuses the first item; arrows move; Escape closes and returns focus
      dd.addEventListener("keydown", e => {
        const list = items(), i = list.indexOf(document.activeElement);
        if (e.key === "Escape") { set(false); trigger.focus(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); set(true); (list[i + 1] || list[0]).focus(); }
        else if (e.key === "ArrowUp" && i >= 0) { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
        else if (e.key === "Home" && i >= 0) { e.preventDefault(); list[0].focus(); }
        else if (e.key === "End" && i >= 0) { e.preventDefault(); list[list.length - 1].focus(); }
      });
      dd.addEventListener("focusout", e => { if (!dd.contains(e.relatedTarget)) set(false); });
      document.addEventListener("click", e => { if (!dd.contains(e.target)) set(false); });
    });
  }

  /* ---- Tabs: [data-tabs] > [role=tablist] button[role=tab][aria-controls] ---- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(root => {
      const tabs = [...root.querySelectorAll('[role="tab"]')];
      const select = tab => tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        root.querySelector("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => select(t));
        t.addEventListener("keydown", e => {
          const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
          if (!dir) return;
          const n = tabs[(i + dir + tabs.length) % tabs.length];
          n.focus(); select(n);
        });
      });
    });
  }

  /* ---- Copy buttons: <button data-copy="#selector"> ---- */
  function initCopy() {
    document.addEventListener("click", async e => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const src = document.querySelector(btn.dataset.copy);
      try { await navigator.clipboard.writeText(src.value ?? src.textContent); toast("Copied to clipboard"); }
      catch { toast("Copy failed. Select the text and copy it manually."); }
    });
  }

  /* ---- Dropzone: preview only, nothing is uploaded or processed ---- */
  const size = b => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";
  function initDropzones() {
    document.querySelectorAll("[data-dropzone]").forEach(zone => {
      const input = zone.querySelector("input[type=file]");
      const list = document.querySelector(zone.dataset.dropzone);
      const show = files => {
        list.replaceChildren();
        [...files].forEach(f => {
          const row = document.createElement("div");
          row.className = "file-item";
          row.innerHTML = Icons.get("file", 18);
          const name = document.createElement("span"); name.className = "file-item__name"; name.textContent = f.name;
          const sz = document.createElement("span"); sz.className = "file-item__size"; sz.textContent = size(f.size);
          row.append(name, sz);
          list.appendChild(row);
        });
        if (files.length) toast(files.length + (files.length > 1 ? " files" : " file") + " added (preview only)");
      };
      zone.addEventListener("click", () => input.click());
      zone.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
      input.addEventListener("click", e => e.stopPropagation());
      input.addEventListener("change", () => show(input.files));
      ["dragenter", "dragover"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("is-over"); }));
      ["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("is-over"); }));
      zone.addEventListener("drop", e => show(e.dataTransfer.files));
    });
  }

  function init() {
    Icons.hydrate();
    initThemeToggle(); initDropdowns(); initTabs(); initCopy(); initDropzones();
  }
  return { init, toast };
})();
document.addEventListener("DOMContentLoaded", UI.init);
