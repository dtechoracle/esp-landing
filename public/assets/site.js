/* Shared by index.html and tutorials.html.
   Draws the footer social icons from CONTENT.SOCIALS (assets/content.js). */
(function () {
  var ICONS = {
    instagram: { label: "Instagram", svg: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/>' },
    tiktok:    { label: "TikTok",    svg: '<path fill="currentColor" d="M16.6 2.5c.3 2.3 1.7 4 4 4.3v3.3c-1.5 0-2.9-.4-4-1.2v6.4a6.3 6.3 0 1 1-6.3-6.3c.3 0 .7 0 1 .1v3.4a2.9 2.9 0 1 0 2 2.8V2.5h3.3z"/>' },
    facebook:  { label: "Facebook",  svg: '<path fill="currentColor" d="M13.5 21.5v-8h2.7l.4-3.2h-3.1V8.3c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4v3.2h2.8v8h3.3z"/>' },
    whatsapp:  { label: "WhatsApp channel", svg: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3.6 20.4l1.2-4.3A8.6 8.6 0 1 1 8 19.3z"/><path fill="currentColor" d="M9 7.6c-.3 0-.7.1-.9.5-.4.5-.8 1.2-.6 2.2.4 1.8 2.7 4.6 5.5 5.6 1 .4 1.8.2 2.3-.2.4-.3.6-.8.6-1.2l-.1-.3-1.9-.9c-.2-.1-.4 0-.5.1l-.6.8c-.1.1-.3.2-.5.1-1.1-.5-2-1.3-2.6-2.4-.1-.2 0-.3.1-.4l.5-.6c.1-.2.1-.3.1-.5l-.8-1.9c-.1-.3-.3-.4-.6-.4H9z"/>' },
    youtube:   { label: "YouTube",   svg: '<rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="M10 9v6l5.2-3z" fill="#fff"/>' },
    linkedin:  { label: "LinkedIn",  svg: '<rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor"/><path fill="#fff" d="M7 10h2.4v7H7zm1.2-3.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zM11 10h2.3v1c.4-.7 1.2-1.2 2.4-1.2 2.2 0 2.6 1.4 2.6 3.3V17h-2.4v-3.4c0-.9 0-1.9-1.2-1.9s-1.4.9-1.4 1.8V17H11z"/>' },
    x:         { label: "X",         svg: '<path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.3L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/>' }
  };
  var ORDER = ["instagram", "tiktok", "facebook", "whatsapp", "youtube", "linkedin", "x"];

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  window.renderSocials = function () {
    var links = (window.CONTENT && CONTENT.SOCIALS) || {};
    var html = "";
    ORDER.forEach(function (key) {
      var url = links[key];
      if (typeof url !== "string" || !url.trim()) return;
      html += '<a class="social" href="' + esc(url.trim()) + '" target="_blank" rel="noopener" aria-label="EventSpacePro on ' + ICONS[key].label + '" title="' + ICONS[key].label + '">' +
              '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[key].svg + "</svg></a>";
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-socials]"), function (el) {
      el.innerHTML = html; el.hidden = !html;
    });
  };

  /* Turns any normal YouTube link into its video ID (watch?v=, youtu.be/, shorts/, embed/, live/). */
  window.youtubeId = function (url) {
    if (typeof url !== "string") return "";
    var m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : "");
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", window.renderSocials);
  else window.renderSocials();
})();
