/* ==========================================================================
   ADDITIVE — additive.mx
   Progressive enhancement only. The site works fully without JavaScript;
   this file adds navigation, reveal animations and the quote-form UX.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- i18n UI messages ----------------------------------------- */
  var LANG = String(doc.documentElement.lang || "es-MX").slice(0, 2).toLowerCase();
  var MSG = {
    es: {
      fileMax: "Máximo {n} archivos.",
      fileType: "Formato no permitido: {name}",
      fileSize: "{name} excede 10 MB.",
      fileTotal: "El total de archivos no debe superar 10 MB.",
      removeFile: "Quitar archivo",
      reqName: "Escribe tu nombre.",
      reqEmail: "Escribe tu correo.",
      reqEmailInvalid: "Correo no válido.",
      reqService: "Selecciona un servicio.",
      reqDescription: "Describe brevemente tu requerimiento (mín. 10 caracteres).",
      checkFields: "Revisa los campos marcados antes de enviar.",
      sending: "Enviando…",
      okTitle: "<b>Gracias{name}.</b> Recibimos tu solicitud. Te responderemos a la brevedad con la estrategia de fabricación y una cotización.",
      mailTitle: "<b>Abriendo tu cliente de correo…</b> Si no se abre, escríbenos a <a href='mailto:raaayala@gmail.com'>raaayala@gmail.com</a> con tu descripción. Recuerda <b>adjuntar tus archivos</b> (STEP, STL, PDF, etc.).",
      errSend: "No pudimos enviar el formulario por el canal directo. Abriendo tu correo…",
      subjectPrefix: "Solicitud de cotización — ",
      lName: "Nombre",
      lCompany: "Empresa",
      lEmail: "Correo",
      lPhone: "Teléfono",
      lService: "Servicio",
      lMaterial: "Material",
      lQuantity: "Cantidad",
      lDate: "Fecha requerida",
      lDescription: "Descripción"
    },
    en: {
      fileMax: "Maximum {n} files.",
      fileType: "Not an allowed format: {name}",
      fileSize: "{name} exceeds 10 MB.",
      fileTotal: "The total file size must not exceed 10 MB.",
      removeFile: "Remove file",
      reqName: "Enter your name.",
      reqEmail: "Enter your email.",
      reqEmailInvalid: "Invalid email.",
      reqService: "Select a service.",
      reqDescription: "Briefly describe your requirement (min. 10 characters).",
      checkFields: "Review the highlighted fields before sending.",
      sending: "Sending…",
      okTitle: "<b>Thank you{name}.</b> We received your request. We will reply shortly with the manufacturing strategy and a quote.",
      mailTitle: "<b>Opening your email client…</b> If it does not open, write to <a href='mailto:raaayala@gmail.com'>raaayala@gmail.com</a> with your description. Remember to <b>attach your files</b> (STEP, STL, PDF, etc.).",
      errSend: "We could not send the form through the direct channel. Opening your email…",
      subjectPrefix: "Quote request — ",
      lName: "Name",
      lCompany: "Company",
      lEmail: "Email",
      lPhone: "Phone",
      lService: "Service",
      lMaterial: "Material",
      lQuantity: "Quantity",
      lDate: "Required date",
      lDescription: "Description"
    },
    de: {
      fileMax: "Maximal {n} Dateien.",
      fileType: "Nicht erlaubtes Format: {name}",
      fileSize: "{name} überschreitet 10 MB.",
      fileTotal: "Die Gesamtgröße darf 10 MB nicht überschreiten.",
      removeFile: "Datei entfernen",
      reqName: "Bitte geben Sie Ihren Namen ein.",
      reqEmail: "Bitte geben Sie Ihre E-Mail ein.",
      reqEmailInvalid: "Ungültige E-Mail.",
      reqService: "Bitte wählen Sie eine Leistung.",
      reqDescription: "Beschreiben Sie kurz Ihre Anforderung (mind. 10 Zeichen).",
      checkFields: "Überprüfen Sie die markierten Felder vor dem Senden.",
      sending: "Wird gesendet…",
      okTitle: "<b>Vielen Dank{name}.</b> Wir haben Ihre Anfrage erhalten. Wir melden uns schnellstmöglich mit der Fertigungsstrategie und einem Angebot.",
      mailTitle: "<b>Ihr E-Mail-Programm wird geöffnet…</b> Falls es nicht geöffnet wird, schreiben Sie an <a href='mailto:raaayala@gmail.com'>raaayala@gmail.com</a> mit Ihrer Beschreibung. Denken Sie daran, <b>Ihre Dateien anzuhängen</b> (STEP, STL, PDF, usw.).",
      errSend: "Das Formular konnte nicht über den direkten Kanal gesendet werden. Ihr E-Mail-Programm wird geöffnet…",
      subjectPrefix: "Angebotsanfrage — ",
      lName: "Name",
      lCompany: "Unternehmen",
      lEmail: "E-Mail",
      lPhone: "Telefon",
      lService: "Leistung",
      lMaterial: "Material",
      lQuantity: "Menge",
      lDate: "Gewünschtes Datum",
      lDescription: "Beschreibung"
    }
  };
  function t(key) {
    var m = (MSG[LANG] || MSG.es)[key];
    return m === undefined ? key : m;
  }

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
  var FILE_MAX = 10 * 1024 * 1024; // 10 MB por archivo (límite del proveedor de correo)
  var TOTAL_MAX = 10 * 1024 * 1024; // 10 MB en total por envío (límite duro de FormSubmit)
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
        '<button type="button" aria-label="' + t("removeFile") + '"><svg aria-hidden="true"><use href="#i-x"/></svg></button>';
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
        if (errEl) errEl.textContent = t("fileMax").replace("{n}", FILE_MAX_COUNT);
        return;
      }
      if (ALLOWED.indexOf(ext(f.name)) === -1) {
        if (errEl) errEl.textContent = t("fileType").replace("{name}", f.name);
        return;
      }
      if (f.size > FILE_MAX) {
        if (errEl) errEl.textContent = t("fileSize").replace("{name}", f.name);
        return;
      }
      var used = selected.reduce(function (s, x) { return s + x.size; }, 0);
      if (used + f.size > TOTAL_MAX) {
        if (errEl) errEl.textContent = t("fileTotal");
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

    if (!nombre.value.trim()) { setError("q-nombre", t("reqName")); ok = false; }
    if (!correo.value.trim()) { setError("q-correo", t("reqEmail")); ok = false; }
    else if (!EMAIL_RE.test(correo.value.trim())) { setError("q-correo", t("reqEmailInvalid")); ok = false; }
    if (!servicio.value) { setError("q-servicio", t("reqService")); ok = false; }
    if (!desc.value.trim() || desc.value.trim().length < 10) {
      setError("q-descripcion", t("reqDescription"));
      ok = false;
    }
    return ok;
  }
  function collect() {
    var data = new FormData();
    data.append("nombre", (doc.getElementById("q-nombre") || {}).value || "");
    data.append("empresa", (doc.getElementById("q-empresa") || {}).value || "");
    data.append("email", (doc.getElementById("q-correo") || {}).value || "");
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
    var subject = t("subjectPrefix") + ((doc.getElementById("q-servicio") || {}).value || "ADDITIVE");
    var L = [
      t("lName") + ": " + ((doc.getElementById("q-nombre") || {}).value || ""),
      t("lCompany") + ": " + ((doc.getElementById("q-empresa") || {}).value || ""),
      t("lEmail") + ": " + ((doc.getElementById("q-correo") || {}).value || ""),
      t("lPhone") + ": " + ((doc.getElementById("q-telefono") || {}).value || ""),
      t("lService") + ": " + ((doc.getElementById("q-servicio") || {}).value || ""),
      t("lMaterial") + ": " + ((doc.getElementById("q-material") || {}).value || ""),
      t("lQuantity") + ": " + ((doc.getElementById("q-cantidad") || {}).value || ""),
      t("lDate") + ": " + ((doc.getElementById("q-fecha") || {}).value || ""),
      "",
      t("lDescription") + ":",
      ((doc.getElementById("q-descripcion") || {}).value || "")
    ];
    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(L.join("\n"));
  }

  if (form) {
    var fecha = doc.getElementById("q-fecha");
    if (fecha) {
      var now = new Date();
      var iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      fecha.min = iso;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot
      var hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;

      if (!validate()) {
        showStatus("is-err", t("checkFields"));
        var firstErr = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstErr) firstErr.focus();
        return;
      }

      var endpoint = (form.getAttribute("data-endpoint") || "").trim();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = t("sending"); }

      function doneOk(name) {
        showStatus("is-ok", t("okTitle").replace("{name}", name ? ", " + name : ""));
        form.reset();
        selected = [];
        renderList();
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }
      function doneMail() {
        window.location.href = mailtoFallback();
        showStatus("is-ok", t("mailTitle"));
        if (btn) { btn.disabled = false; btn.innerHTML = original; }
      }

      if (!endpoint) { doneMail(); return; }

      fetch(endpoint, { method: "POST", body: collect(), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json().catch(function () { return {}; });
        })
        .then(function (json) {
          if (json && String(json.success) === "false") throw new Error(json.message || "rechazado");
          doneOk(((doc.getElementById("q-nombre") || {}).value || "").split(" ")[0]);
        })
        .catch(function () {
          showStatus("is-err", t("errSend"));
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
