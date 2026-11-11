// Mariya Builders — shared site script
(function () {
  "use strict";

  var PHONE = "917034353114"; // country code + number, used for WhatsApp

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal-on-scroll animation
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Project gallery — built from js/projects.js
  // Layout repeats in groups of five: two wide photos, then three tall ones.
  document.querySelectorAll("[data-projects]").forEach(function (box) {
    var list = window.MB_PROJECTS || [];
    var limit = parseInt(box.getAttribute("data-projects"), 10) || list.length;
    list.slice(0, limit).forEach(function (p, i) {
      var fig = document.createElement("figure");
      fig.className = "project reveal visible" + (i % 5 < 2 ? " wide" : "");
      var img = document.createElement("img");
      img.src = "images/" + p.file;
      img.alt = (p.title || "Project") + " built by Mariya Builders";
      img.loading = "lazy";
      img.onerror = function () { fig.remove(); };
      var cap = document.createElement("figcaption");
      var t = document.createElement("strong"); t.textContent = p.title || "";
      var d = document.createElement("span"); d.textContent = p.details || "";
      cap.appendChild(t); cap.appendChild(d);
      fig.appendChild(img); fig.appendChild(cap);
      box.appendChild(fig);
    });
  });

  // Project gallery lightbox
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var close = function () { lightbox.classList.remove("open"); };
    document.querySelectorAll(".project").forEach(function (p) {
      p.addEventListener("click", function () {
        var img = p.querySelector("img");
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target !== lbImg) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  // Enquiry form -> opens WhatsApp with the details pre-filled
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg =
        "Hello Mariya Builders,\n\n" +
        "Name: " + d.get("name") + "\n" +
        "Phone: " + d.get("phone") + "\n" +
        "Service: " + d.get("service") + "\n" +
        (d.get("location") ? "Site location: " + d.get("location") + "\n" : "") +
        (d.get("message") ? "\n" + d.get("message") : "");
      window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }

  // ---------- Ratings & reviews ----------
  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z"/></svg>';
  function stars(n) {
    var s = "";
    for (var i = 1; i <= 5; i++) s += i <= Math.round(n) ? STAR : STAR.replace("<svg ", '<svg class="off" ');
    return '<span class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + s + "</span>";
  }
  function esc(t) {
    return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var reviews = (window.MB_REVIEWS || []).filter(function (r) { return r && r.rating; });

  var summary = document.getElementById("rating-summary");
  if (summary && reviews.length) {
    var total = 0, counts = [0, 0, 0, 0, 0];
    reviews.forEach(function (r) { total += r.rating; counts[r.rating - 1]++; });
    var avg = (total / reviews.length).toFixed(1);
    var bars = "";
    for (var s = 5; s >= 1; s--) {
      var pct = Math.round((counts[s - 1] / reviews.length) * 100);
      bars += '<div class="rating-bar"><span>' + s + ' ★</span><div class="track"><div class="fill" style="width:' + pct + '%"></div></div><span>' + counts[s - 1] + "</span></div>";
    }
    summary.innerHTML =
      '<div class="rating-score"><div class="big">' + avg + "</div>" + stars(avg) +
      "<small>Based on " + reviews.length + " review" + (reviews.length > 1 ? "s" : "") + "</small></div>" +
      '<div class="rating-bars">' + bars + "</div>";
  } else if (summary) {
    summary.style.display = "none";
  }

  document.querySelectorAll("[data-reviews]").forEach(function (box) {
    var limit = parseInt(box.getAttribute("data-reviews"), 10) || reviews.length;
    box.innerHTML = reviews.slice(0, limit).map(function (r) {
      var initial = esc((r.name || "?").trim().charAt(0).toUpperCase());
      return '<article class="review-card reveal visible">' + stars(r.rating) +
        "<p>" + esc(r.text) + "</p>" +
        '<div class="review-author"><span class="avatar">' + initial + "</span><div><strong>" + esc(r.name) +
        (r.sample ? '<span class="tag-sample">Sample</span>' : "") + "</strong><span>" +
        esc([r.project, r.place].filter(Boolean).join(" · ")) + "</span></div></div></article>";
    }).join("");
  });

  // Write-a-review form -> WhatsApp
  var rform = document.getElementById("review-form");
  if (rform) {
    rform.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(rform);
      if (!d.get("rating")) { alert("Please choose a star rating."); return; }
      var n = parseInt(d.get("rating"), 10);
      var msg =
        "Review for Mariya Builders\n\n" +
        "Rating: " + "★".repeat(n) + "☆".repeat(5 - n) + " (" + n + "/5)\n" +
        "Name: " + d.get("rname") + "\n" +
        (d.get("rplace") ? "Place: " + d.get("rplace") + "\n" : "") +
        (d.get("rproject") ? "Project: " + d.get("rproject") + "\n" : "") +
        "\n" + d.get("rtext");
      window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }

  // ---------- Header: solid once the page scrolls ----------
  var headerEl = document.querySelector(".site-header");
  if (headerEl) {
    var onScroll = function () { headerEl.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---------- Hero slideshow ----------
  var slides = document.querySelectorAll(".hero-slide");
  var dots = document.querySelectorAll(".hero-dots span");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (slides.length > 1) {
    var cur = 0;
    setInterval(function () {
      slides[cur].classList.remove("active");
      if (dots[cur]) dots[cur].classList.remove("active");
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add("active");
      if (dots[cur]) dots[cur].classList.add("active");
    }, reduceMotion ? 9000 : 6500);
  }

  // ---------- Calling ----------
  // Phones dial straight away through the tel: link.
  // Laptops/desktops usually have no phone app, so a tel: link does nothing there;
  // on those devices we show a call box with the number, a QR code to scan
  // with a phone, a copy button, and a "call from this device" option.
  var dialog = document.getElementById("call-dialog");
  var isPhone = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)); // iPadOS
  var lastFocus = null;
  function openCall() {
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.body.style.overflow = "hidden";
    var c = dialog.querySelector(".call-close");
    if (c) c.focus();
  }
  function closeCall() {
    dialog.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (dialog) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="tel:"]');
      if (!a || a.hasAttribute("data-direct") || isPhone) return; // let the phone dial
      e.preventDefault();
      openCall();
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest(".call-close")) closeCall();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dialog.hidden) closeCall();
    });
    var copyBtn = dialog.querySelector("[data-copy]");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var num = copyBtn.getAttribute("data-copy");
        var done = function () {
          copyBtn.textContent = "Copied ✓";
          setTimeout(function () { copyBtn.textContent = "Copy Number"; }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(num).then(done, function () { window.prompt("Copy the number:", num); });
        } else {
          window.prompt("Copy the number:", num);
        }
      });
    }
  }

  // Footer year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
