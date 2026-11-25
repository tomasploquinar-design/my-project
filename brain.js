/* Mellizo — "Company brain" demo on the home page.
   Story, left to right: a client system emits a record -> it lands as a raw row
   (Extract) -> it becomes a clean event log (Transform) -> it is loaded into the
   brain graph (Load) -> the team asks the brain questions (Ask). */
(function () {
  var root = document.getElementById("brain-demo");
  if (!root) return;

  var NS = "http://www.w3.org/2000/svg";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stacked = window.matchMedia("(max-width: 1000px)");
  var srcEls = root.querySelectorAll("[data-src]");
  var pipes = root.querySelectorAll(".pipe");
  var rawEl = document.getElementById("b-raw");
  var logEl = document.getElementById("b-log");
  var graph = document.getElementById("b-graph");
  var countEl = document.getElementById("b-count");
  var qEl = document.getElementById("b-q");
  var aEl = document.getElementById("b-a");

  function lang() { return document.documentElement.getAttribute("data-lang") === "es" ? "es" : "en"; }
  function bi(en, es) { return '<span data-l="en">' + en + '</span><span data-l="es">' + es + "</span>"; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- What each client system sends (order matches the source list) ---------- */
  var SOURCES = [
    { tag: "SF", ev: [
      { raw: "OPP-0{n}|18400|Negotiation|acct_GA", type: "deal.updated", en: "Grupo Andes · $18.4k · negotiation", es: "Grupo Andes · $18.4k · negociación", ents: ["deal", "customer"] },
      { raw: "OPP-0{n}|7250|Closed Won|acct_FS", type: "deal.won", en: "Ferretería Sur · $7.2k · won", es: "Ferretería Sur · $7.2k · ganada", ents: ["deal", "order"] } ] },
    { tag: "WA", ev: [
      { raw: '+52 55 ••{n}|"40 cajas sku118 jue"', type: "order.created", en: "Ferretería Sur · SKU-118 × 40 · Thu", es: "Ferretería Sur · SKU-118 × 40 · jue", ents: ["order", "customer", "sku"] },
      { raw: '+57 31 ••{n}|"¿ya salió mi pedido?"', type: "order.status_asked", en: "Distribuidora Norte · order #8812", es: "Distribuidora Norte · pedido #8812", ents: ["customer", "order"] } ] },
    { tag: "@", ev: [
      { raw: "fact_{n}.pdf|Acme Supplies|2,140.00", type: "invoice.received", en: "Acme Supplies · $2,140 · due Dec 12", es: "Acme Supplies · $2,140 · vence 12 dic", ents: ["invoice", "supplier"] },
      { raw: "RE: cotización {n}|compras@grupoandes", type: "quote.requested", en: "Grupo Andes · 3 SKUs · quote", es: "Grupo Andes · 3 SKUs · cotización", ents: ["customer", "deal", "sku"] } ] },
    { tag: "OR", ev: [
      { raw: "GL-4{n}|6100|-3220.00|FRT", type: "ledger.posted", en: "Freight expense · −$3,220", es: "Gasto de flete · −$3,220", ents: ["payment", "invoice"] },
      { raw: "AR-{n}|CLI-0087|12,900.00|PAID", type: "payment.received", en: "Grupo Andes · $12.9k · settled", es: "Grupo Andes · $12.9k · pagado", ents: ["payment", "customer"] } ] },
    { tag: "XL", ev: [
      { raw: "Forecast_Q4!C{n}|1250|=B4*1.1", type: "forecast.changed", en: "SKU-118 · Q4 demand +10%", es: "SKU-118 · demanda Q4 +10%", ents: ["sku", "order"] },
      { raw: "Precios_v7!D{n}|SKU-118|4.85", type: "price.updated", en: "SKU-118 · $4.85 / box", es: "SKU-118 · $4.85 / caja", ents: ["sku", "supplier"] } ] }
  ];

  /* ---------- Questions the brain answers (from the whiteboard) ---------- */
  var QUESTIONS = [
    { en: "What was EBITDA yesterday?", es: "¿Cuál fue el EBITDA de ayer?", val: "$48.2k",
      sub: ["+6% vs. 30-day average", "+6% vs. promedio de 30 días"], src: ["ERP", "Excel"], ents: ["invoice", "payment", "supplier"] },
    { en: "How much did we sell last month?", es: "¿Cuánto vendimos el mes pasado?", val: "$1.34M",
      sub: ["412 orders · top client Grupo Andes", "412 pedidos · principal cliente Grupo Andes"], src: ["CRM", "ERP"], ents: ["customer", "deal", "order"] },
    { en: "How many orders are still pending delivery?", es: "¿Cuántos pedidos faltan por entregar?", val: "37",
      sub: ["6 at risk of arriving late", "6 en riesgo de llegar tarde"], src: ["ERP", "WhatsApp"], ents: ["order", "sku", "customer"] }
  ];

  /* ---------- Brain graph: business entities and how they relate ---------- */
  var ENT = {
    customer: { x: 150, y: 62,  en: "Customer", es: "Cliente" },
    deal:     { x: 240, y: 112, en: "Deal",     es: "Oportunidad" },
    order:    { x: 90,  y: 132, en: "Order",    es: "Pedido" },
    sku:      { x: 56,  y: 218, en: "SKU",      es: "SKU" },
    invoice:  { x: 196, y: 196, en: "Invoice",  es: "Factura" },
    payment:  { x: 128, y: 246, en: "Payment",  es: "Pago" },
    supplier: { x: 250, y: 244, en: "Supplier", es: "Proveedor" }
  };
  var LINKS = [["customer", "deal"], ["customer", "order"], ["deal", "order"], ["order", "sku"], ["order", "invoice"],
    ["invoice", "supplier"], ["invoice", "payment"], ["payment", "customer"], ["sku", "supplier"]];

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var gEdges = el("g", {}, graph), gSmall = el("g", {}, graph), gEnt = el("g", {}, graph), gFx = el("g", {}, graph);
  var edgeMap = {};
  function key(a, b) { return a < b ? a + "|" + b : b + "|" + a; }
  function line(a, b, cls) { return el("line", { "class": "ge" + (cls ? " " + cls : ""), x1: a.x, y1: a.y, x2: b.x, y2: b.y }, gEdges); }

  LINKS.forEach(function (l) { edgeMap[key(l[0], l[1])] = line(ENT[l[0]], ENT[l[1]]); });

  // Fixed constellation of small records around each entity.
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function satellite(e, r0, r1) {
    var a = rnd() * Math.PI * 2, r = r0 + rnd() * (r1 - r0);
    return { x: Math.min(290, Math.max(10, e.x + Math.cos(a) * r)), y: Math.min(290, Math.max(10, e.y + Math.sin(a) * r)) };
  }
  Object.keys(ENT).forEach(function (k) {
    for (var i = 0; i < 4; i++) {
      var p = satellite(ENT[k], 24, 44);
      line(ENT[k], p);
      el("circle", { "class": "gs", cx: p.x, cy: p.y, r: 2.2 }, gSmall);
    }
  });

  Object.keys(ENT).forEach(function (k) {
    var e = ENT[k];
    var g = el("g", { "class": "ent", transform: "translate(" + e.x + "," + e.y + ")" }, gEnt);
    el("circle", { "class": "halo", r: 15 }, g);
    el("circle", { "class": "dot", r: 5 }, g);
    ["en", "es"].forEach(function (l) {
      var t = el("text", { y: 22, "text-anchor": "middle", "data-l": l }, g);
      t.textContent = e[l];
    });
    e.g = g;
  });

  /* ---------- Pipeline steps ---------- */
  var links = 48210, seq = 4810, grown = [];

  function limits() { return stacked.matches ? { raw: 4, log: 3 } : { raw: 7, log: 5 }; }
  function trim(box, max) { while (box.children.length > max) box.lastElementChild.remove(); }

  function addRaw(src, ev) {
    var row = document.createElement("div");
    row.className = "rawr";
    var b = document.createElement("b"); b.textContent = src.tag;
    var s = document.createElement("span"); s.textContent = ev.raw.replace("{n}", seq);
    row.appendChild(b); row.appendChild(s);
    rawEl.prepend(row);
    trim(rawEl, limits().raw);
  }

  function addLog(ev) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="lt"><span>' + new Date().toTimeString().slice(0, 8) + "</span><code>" + ev.type +
      '</code></span><span class="lx">' + bi(ev.en, ev.es) + "</span>";
    logEl.prepend(li);
    trim(logEl, limits().log);
  }

  function flash(node, cls, ms) { node.classList.add(cls); setTimeout(function () { node.classList.remove(cls); }, ms); }

  function load(ev) {
    var target = ENT[ev.ents[0]];
    var from = stacked.matches ? "translate(150px,-8px)" : "translate(-8px,150px)";
    var pk = el("circle", { "class": "pk", r: 3.5 }, gFx);
    var anim = pk.animate([{ transform: from }, { transform: "translate(" + target.x + "px," + target.y + "px)" }],
      { duration: 650, easing: "cubic-bezier(.5,0,.3,1)", fill: "forwards" });
    anim.onfinish = function () {
      pk.remove();
      var ping = el("circle", { "class": "ping", cx: target.x, cy: target.y, r: 5 }, gFx);
      setTimeout(function () { ping.remove(); }, 950);
      ev.ents.forEach(function (k) { flash(ENT[k].g, "hot", 900); });
      for (var i = 1; i < ev.ents.length; i++) {
        var e = edgeMap[key(ev.ents[i - 1], ev.ents[i])];
        if (e) flash(e, "hot", 900);
      }
      grow(target);
      links += 1 + Math.floor(Math.random() * 3);
      countEl.textContent = links.toLocaleString("en-US");
    };
  }

  // Each loaded record leaves a new node in the brain; the oldest fade out.
  function grow(e) {
    var p = satellite(e, 30, 58);
    var ln = line(e, p, "fresh"), dot = el("circle", { "class": "gs", cx: p.x, cy: p.y, r: 2.4 }, gSmall);
    grown.push([ln, dot]);
    if (grown.length > 12) {
      var old = grown.shift();
      old.forEach(function (n) { n.classList.add("gone"); setTimeout(function () { n.remove(); }, 700); });
    }
  }

  function travel(pipe, done) {
    var dot = document.createElement("i");
    pipe.appendChild(dot);
    var prop = stacked.matches ? "top" : "left", a = {}, b = {};
    a[prop] = "0%"; b[prop] = "100%";
    dot.animate([a, b], { duration: 520, easing: "cubic-bezier(.5,0,.5,1)" }).onfinish = function () { dot.remove(); done(); };
  }

  function emit(instant) {
    var i = Math.floor(Math.random() * SOURCES.length), src = SOURCES[i], ev = pick(src.ev);
    seq++;
    if (instant) { addRaw(src, ev); addLog(ev); return; }
    flash(srcEls[i], "on", 700);
    travel(pipes[0], function () {
      addRaw(src, ev);
      travel(pipes[1], function () {
        addLog(ev);
        travel(pipes[2], function () { load(ev); });
      });
    });
  }

  /* ---------- Ask the brain ---------- */
  var qi = 0;
  function clearQuery() {
    root.querySelectorAll(".graph .q").forEach(function (n) { n.classList.remove("q"); });
  }
  function answer(q) {
    q.ents.forEach(function (k) { ENT[k].g.classList.add("q"); });
    q.ents.forEach(function (a) { q.ents.forEach(function (b) { var e = edgeMap[key(a, b)]; if (a !== b && e) e.classList.add("q"); }); });
    aEl.innerHTML = '<b class="a-val">' + q.val + '</b><span class="a-meta"><span class="a-sub">' + bi(q.sub[0], q.sub[1]) +
      '</span><span class="a-src">' + bi("From", "Desde") + q.src.map(function (s) { return "<em>" + s + "</em>"; }).join("") + "</span></span>";
    aEl.classList.remove("hide");
  }
  function ask() {
    if (!active()) return setTimeout(ask, 600);
    var q = QUESTIONS[qi++ % QUESTIONS.length], text = q[lang()], n = 0;
    clearQuery();
    aEl.classList.add("hide");
    if (reduced) { qEl.textContent = text; answer(q); return setTimeout(ask, 7000); }
    setTimeout(function type() {
      qEl.textContent = text.slice(0, ++n);
      if (n < text.length) setTimeout(type, 34);
      else setTimeout(function () { answer(q); setTimeout(ask, 5200); }, 500);
    }, 400);
  }

  /* ---------- Run only while on screen ---------- */
  var onScreen = false;
  function active() { return onScreen && !document.hidden; }
  new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; }).observe(root);

  function loop() {
    if (active()) emit(false);
    setTimeout(loop, 1400 + Math.random() * 600);
  }

  for (var k = 0; k < 4; k++) emit(true);
  ask();
  if (!reduced) loop();
})();
