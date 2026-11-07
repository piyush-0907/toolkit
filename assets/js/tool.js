/* Tool page behaviour (UI preview only). Nothing is processed. */
(() => {
  const body = document.body, mode = body.dataset.mode;
  Store.addRecentTool(body.dataset.tool);

  const $ = id => document.getElementById(id);
  const hasInput = () => {
    if (mode === "file") return $("file-list").children.length > 0;
    if (mode === "text") return $("main-input").value.trim() !== "";
    if (mode === "text2") return $("main-input0").value.trim() !== "" || $("main-input1").value.trim() !== "";
    return true;
  };
  const hint = { file: "Add a file first.", text: "Add some text first.", text2: "Add some text to compare first." };

  $("run-btn").addEventListener("click", () => {
    if (!hasInput()) return UI.toast(hint[mode]);
    UI.toast("Preview only. This tool doesn't process anything yet.");
    document.querySelector(".result__note").classList.add("is-flash");
    setTimeout(() => document.querySelector(".result__note").classList.remove("is-flash"), 1200);
  });

  $("reset-btn").addEventListener("click", () => {
    const ws = document.querySelector(".workspace");
    ws.querySelectorAll("input:not([type=file]):not([type=checkbox]), textarea:not([readonly])").forEach(el => { el.value = el.defaultValue; });
    ws.querySelectorAll("input[type=checkbox]").forEach(el => { el.checked = el.defaultChecked; });
    ws.querySelectorAll("select").forEach(el => { el.selectedIndex = Math.max(0, [...el.options].findIndex(o => o.defaultSelected)); });
    if (mode === "file") { $("file-list").replaceChildren(); ws.querySelector("input[type=file]").value = ""; }
  });
})();
