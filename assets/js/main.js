/* ==========================================================================
   ADDITIVE — additive.mx
   Progressive enhancement only. The site works fully without JavaScript;
   this file adds navigation, reveal animations and the quote-form UX.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: compact on scroll --------------------------------- */
  var header = doc.getElementById("header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer --------------------------------------------- */
  var burger = doc.querySelector(".burger");
  var drawer = doc.getElementById("drawer");
  var lastFocus = null;

  function openMenu() {
    if (!drawer) return;
    doc.body.classList.add("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    lastFocus = doc.activeElement;
    var first = drawer.querySelector("a, button");
    if (first) first.focus();
  }
  function closeMenu() {
    if (!drawer) return;
    doc.body.classList.remove("menu-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) {
    burger.addEventListener("click", function () {
      if (doc.body.classList.contains("menu-open")) closeMenu();
      else openMenu();
    });
  }
  if (drawer) {
    drawer.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a") : null;
      if (a) closeMenu();
    });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && doc.body.classList.contains("menu-open")) closeMenu();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024 && doc.body.classList.contains("menu-open")) closeMenu();
  });

  /* ---------- Reveal on scroll ------------------------------------------ */
  var reveals = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- Number counters ------------------------------------------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    var pad = parseInt(el.getAttribute("data-pad"), 10) || 0;
    if (reduceMotion) { el.textContent = String(target).padStart(pad, "0"); return; }
    var start = null, dur = 1100;
    function tick(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased)).padStart(pad, "0");
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = Array.prototype.slice.call(doc.querySelectorAll("[data-counter]"));
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var cObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cObs.observe(el); });
    }
  }

  /* ---------- Active nav link ------------------------------------------- */
  var sections = Array.prototype.slice.call(doc.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll(".nav__link"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    navLinks.forEach(function (l) {
      var id = (l.getAttribute("href") || "").replace("#", "");
      if (id) map[id] = l;
    });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navLinks.forEach(function (l) { l.classList.remove("is-active"); });
          map[en.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { if (map[s.id]) navObs.observe(s); });
  }

  /* ---------- File upload (quote form) ---------------------------------- */
  var FILE_MAX = 15 * 1024 * 1024; // 15 MB
  var FILE_MAX_COUNT = 5;
  var ALLOWED = ["step", "stp", "stl", "obj", "dxf", "pdf", "jpg", "jpeg", "png"];
  var input = doc.getElementById("q-archivos");
  var drop = doc.getElementById("drop");
  var list = doc.getElementById("file-list");
  var selected = [];

  function ext(name) {
    var i = String(name).lastIndexOf(".");
    return i < 0 ? "" : name.slice(i + 1).toLowerCase();
  }
  function humanSize(b) {
    if (b < 1024) return b + " B";
    if (b < 1024 * 1024) return (b / 1024).toFixed(0) + " KB";
    return (b / (1024 * 1024)).toFixed(1) + " MB";
  }
  function renderList() {
    if (!list) return;
    list.innerHTML = "";
    selected.forEach(function (f, idx) {
      var row = doc.createElement("div");
      row.className = "file-row";
      var icon = '<svg aria-hidden="true"><use href="#i-file"/></svg>';
      row.innerHTML = icon + '<span class="name"></span><span class="size"></span>' +
        '<button type="button" aria-label="Quitar archivo"><svg aria-hidden="true"><use href="#i-x"/></svg></button>';
      row.querySelector(".name").textContent = f.name;
      row.querySelector(".size").textContent = humanSize(f.size);
      row.querySelector("button").addEventListener("click", function () {
        selected.splice(idx, 1);
        renderList();
      });
      list.appendChild(row);
    });
  }
  function addFiles(fileList) {
    var incoming = Array.prototype.slice.call(fileList || []);
    var errEl = doc.querySelector('[data-err-for="q-archivos"]');
    if (errEl) errEl.textContent = "";
    incoming.forEach(function (f) {
      if (selected.length >= FILE_MAX_COUNT) {
        if (errEl) errEl.textContent = "Máximo " + FILE_MAX_COUNT + " archivos.";
        return;
      }
      if (ALLOWED.indexOf(ext(f.name)) === -1) {
        if (errEl) errEl.textContent = "Formato no permitido: " + f.name;
        return;
      }
      if (f.size > FILE_MAX) {
        if (errEl) errEl.textContent = f.name + " excede 15 MB.";
        return;
      }
      selected.push(f);
    });
    renderList();
  }
  if (input) {
    input.addEventListener("change", function () { addFiles(input.files); input.value = ""; });
  }
  if (drop) {
    drop.addEventListener("click", function (e) {
      if (input && e.target !== input) input.click();
    });
    drop.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (input) input.click(); }
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-over"); });
    });
    drop.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });
  }

  /* ---------- Quote form validation + submit ---------------------------- */
  var form = doc.getElementById("quote-form");
  var status = doc.getElementById("form-status");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(id, msg) {
    var field = doc.getElementById(id);
    if (!field) return;
    var wrap = field.closest(".field");
    var err = doc.querySelector('[data-err-for="' + id + '"]');
    if (wrap) wrap.classList.toggle("has-error", !!msg);
    if (err) err.textContent = msg || "";
  }
  function showStatus(type, html) {
    if (!status) return;
    status.className = "form-status " + type;
    status.innerHTML = html;
  }
  function validate() {
    var ok = true;
    var nombre = doc.getElementById("q-nombre");
    var correo = doc.getElementById("q-correo");
    var servicio = doc.getElementById("q-servicio");
    var desc = doc.getElementById("q-descripcion");

    setError("q-nombre", "");
    setError("q-correo", "");
    setError("q-servicio", "");
    setError("q-descripcion", "");

    if (!nombre.value.trim()) { setError("q-nombre", "Escribe tu nombre."); ok = false; }
    if (!correo.value.trim()) { setError("q-correo", "Escribe tu correo."); ok = false; }
    else if (!EMAIL_RE.test(correo.value.trim())) { setError("q-correo", "Correo no válido."); ok = false; }
    if (!servicio.value) { setError("q-servicio", "Selecciona un servicio."); ok = false; }
    if (!desc.value.trim() || desc.value.trim().length < 10) {
      setError("q-descripcion", "Describe brevemente tu requerimiento (mín. 10 caracteres).");
      ok = false;
    }
    return ok;
  }
  function collect() {
    var data = new FormData();
    data.append("nombre", (doc.getElementById("q-nombre") || {}).value || "");
    data.append("empresa", (doc.getElementById("q-empresa") || {}).value || "");
    data.append("correo", (doc.getElementById("q-correo") || {}).value || "");
    data.append("telefono", (doc.getElementById("q-telefono") || {}).value || "");
    data.append("servicio", (doc.getElementById("q-servicio") || {}).value || "");
    data.append("material", (doc.getElementById("q-material") || {}).value || "");
    data.append("cantidad", (doc.getElementById("q-cantidad") || {}).value || "");
    data.append("fecha", (doc.getElementById("q-fecha") || {}).value || "");
    data.append("descripcion", (doc.getElementById("q-descripcion") || {}).value || "");
    selected.forEach(function (f) { data.append("archivos", f, f.name); });
    return data;
  }
  function mailtoFallback() {
    var to = "raaayala@gmail.com";
    var subject = "Solicitud de cotización — " + ((doc.getElementById("q-servicio") || {}).value || "ADDITIVE");
    var L = [
      "Nombre: " + ((doc.getElementById("q-nombre") || {}).value || ""),
      "Empresa: " + ((doc.getElementById("q-empresa") || {}).value || ""),
      "Correo: " + ((doc.getElementById("q-correo") || {}).value || ""),
      "Teléfono: " + ((doc.getElementById("q-telefono") || {}).value || ""),
      "Servicio: " + ((doc.getElementById("q-servicio") || {}).value || ""),
      "Material: " + ((doc.getElementById("q-material") || {}).value || ""),
      "Cantidad: " + ((doc.getElementById("q-cantidad") || {}).value || ""),
      "Fecha requerida: " + ((doc.getElementById("q-fecha") || {}).value || ""),
      "",
      "Descripción:",
      ((doc.getElementById("q-descripcion") || {}).value || "")
    ];
    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(L.join("\n"));
  }

  if (form) {
    var fecha = doc.getElementById("q-fecha");
    if (fecha) {
      var t = new Date();
      var iso = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      fecha.min = iso;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot
      var hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;

      if (!validate()) {
        showStatus("is-err", "Revisa los campos marcados antes de enviar.");
        var firstErr = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstErr) firstErr.focus();
        return;
      }

      var endpoint = (form.getAttribute("data-endpoint") || "").trim();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Enviando…"; }

      function doneOk(name) {
        showStatus("is-ok",
          "<b>Gracias" + (name ? ", " + name : "") + ".</b> Recibimos tu solicitud. " +
          "Te responderemos a la brevedad con la estrategia de fabricación y una cotización.");
        form.reset();
        selected = [];
        renderList();
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }
      function doneMail() {
        window.location.href = mailtoFallback();
        showStatus("is-ok",
          "<b>Abriendo tu cliente de correo…</b> Si no se abre, escríbenos a " +
          "<a href='mailto:raaayala@gmail.com'>raaayala@gmail.com</a> " +
          "con tu descripción. Recuerda <b>adjuntar tus archivos</b> (STEP, STL, PDF, etc.).");
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }

      if (!endpoint) { doneMail(); return; }

      fetch(endpoint, { method: "POST", body: collect(), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function () { doneOk(((doc.getElementById("q-nombre") || {}).value || "").split(" ")[0]); })
        .catch(function () {
          showStatus("is-err", "No pudimos enviar el formulario por el canal directo. Abriendo tu correo…");
          doneMail();
        });
    });

    // clear field error on input
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      var ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, function () {
        var wrap = el.closest(".field");
        if (wrap) wrap.classList.remove("has-error");
        var err = doc.querySelector('[data-err-for="' + el.id + '"]');
        if (err) err.textContent = "";
      });
    });
  }
})();
