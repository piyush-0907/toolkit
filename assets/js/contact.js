/* Contact form: UI preview only. Nothing is sent. */
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  UI.toast("Preview only. Your message was not sent.");
});
