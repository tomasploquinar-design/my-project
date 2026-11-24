/* Mellizo — the animated walkthrough on platform.html.
   Plays five scenes in order and loops. The five cells under the window show
   progress and jump to a scene. With reduced motion it does not play: every
   scene shows its finished state and the cells step through them. */

(function () {
  var root = document.getElementById("demo");
  if (!root) return;

  var scenes = [].slice.call(root.querySelectorAll(".d-scene"));
  var steps = [].slice.call(root.querySelectorAll(".d-step"));
  var titleEn = document.getElementById("d-title-en");
  var titleEs = document.getElementById("d-title-es");
  var planned = document.getElementById("d-planned");
  var toggle = document.getElementById("d-toggle");
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var current = 0, elapsed = 0, playing = !reduced, last = null;

  // Numbers that count up while a scene plays.
  function counters() {
    [].forEach.call(scenes[current].querySelectorAll("[data-count]"), function (el) {
      var target = Number(el.getAttribute("data-count"));
      var start = Number(el.getAttribute("data-at") || 0);
      var p = reduced ? 1 : Math.max(0, Math.min(1, (elapsed - start) / 1400));
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US");
    });
  }

  function show(n) {
    current = n;
    elapsed = 0;
    scenes.forEach(function (s, k) { s.hidden = k !== n; s.classList.remove("on"); });
    void scenes[n].offsetWidth; // restart the entrance animations
    if (!reduced) scenes[n].classList.add("on");
    steps.forEach(function (b, k) {
      if (k === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.querySelector(".d-fill").style.width = k < n ? "100%" : "0";
    });
    titleEn.textContent = scenes[n].getAttribute("data-title-en");
    titleEs.textContent = scenes[n].getAttribute("data-title-es");
    planned.hidden = !scenes[n].hasAttribute("data-planned");
    counters();
  }

  function frame(t) {
    if (last !== null && playing) elapsed += Math.min(100, t - last);
    last = t;
    var dur = Number(scenes[current].getAttribute("data-dur"));
    steps[current].querySelector(".d-fill").style.width = Math.min(100, 100 * elapsed / dur) + "%";
    counters();
    if (elapsed >= dur) show((current + 1) % scenes.length);
    requestAnimationFrame(frame);
  }

  function setPlaying(on) {
    playing = on;
    root.classList.toggle("d-paused", !on);
    toggle.setAttribute("data-state", on ? "playing" : "paused");
  }

  steps.forEach(function (b, k) { b.addEventListener("click", function () { show(k); }); });
  toggle.addEventListener("click", function () { setPlaying(!playing); });
  document.getElementById("d-restart").addEventListener("click", function () { show(0); setPlaying(true); });

  show(0);
  if (reduced) {
    toggle.hidden = true;
  } else {
    setPlaying(true);
    requestAnimationFrame(frame);
  }
})();
