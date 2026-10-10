/* nexChat by Exira Labs — shared site behaviour (no dependencies) */
(function () {
  "use strict";

  /*
   * Site configuration.
   * CONTACT_EMAIL is also written into the HTML of every page so it works
   * without JavaScript. If you change it here, change the HTML defaults too
   * (search the project for the current address) so both stay identical.
   */
  var CONFIG = {
    CONTACT_EMAIL: "support@exiralabs.com"
  };

  // Keep every displayed email and its mailto: link in sync with CONFIG.
  document.querySelectorAll("[data-contact-email]").forEach(function (el) {
    var subject = el.getAttribute("data-subject");
    if (el.tagName === "A") {
      el.href = "mailto:" + CONFIG.CONTACT_EMAIL + (subject ? "?subject=" + encodeURIComponent(subject) : "");
    }
    var label = el.querySelector("[data-contact-email-text]") || (el.hasAttribute("data-contact-email-text") ? el : null);
    if (label) label.textContent = CONFIG.CONTACT_EMAIL;
  });
  document.querySelectorAll("[data-contact-email-only]").forEach(function (el) {
    el.textContent = CONFIG.CONTACT_EMAIL;
  });

  // Legacy anchors from the earlier single-page version (e.g. /#privacy).
  var legacy = { "#privacy": "privacy-policy.html", "#terms": "terms-of-service.html", "#deletion": "data-deletion.html" };
  if (document.body.hasAttribute("data-home") && legacy[location.hash]) {
    location.replace(legacy[location.hash]);
    return;
  }

  // Current year in footers.
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // Mobile navigation.
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Header border once the page scrolls.
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Highlight the current section in a legal page's table of contents.
  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var firstId = null;
      document.querySelectorAll(".prose > section[id]").forEach(function (s) {
        if (!firstId && visible[s.id]) firstId = s.id;
      });
      if (!firstId) return;
      tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
      if (byId[firstId]) byId[firstId].classList.add("is-active");
    }, { rootMargin: "-80px 0px -55% 0px" });
    document.querySelectorAll(".prose > section[id]").forEach(function (s) { observer.observe(s); });
  }
})();
