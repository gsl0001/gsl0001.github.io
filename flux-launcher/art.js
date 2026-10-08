// Draws the site's vector art: the same generators as the brand canvas's
// Art board (Aperture, Rings, Spectrum, Contour, Trace). Decorative only —
// every figure is aria-hidden or labelled, so the page reads without it.
(() => {
  const f = (n) => n.toFixed(1);
  const set = (id, d) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("d", d);
  };

  // Aperture: every kind of input pinched through Ctrl+Space into one sheet.
  let wire = "", cyan = "", hot = "";
  for (let i = 0; i < 44; i++) {
    const y = 20 + i * 11.2, ya = 260 + (y - 260) * 0.07, yo = 260 + (y - 260) * 0.72;
    const d = `M90 ${f(y)}C220 ${f(y)} 250 ${f(ya)} 324 ${f(ya)}C410 ${f(ya)} 470 ${f(yo)} 640 ${f(yo)}`;
    if (i === 21) hot = d;
    else if (i % 6 === 2) cyan += d;
    else wire += d;
  }
  set("flow-wire", wire);
  set("flow-cyan", cyan);
  set("flow-pulse", cyan);
  set("flow-hot", hot);
  set("flow-hot-glow", hot);

  // Rings: segmented arcs, coloured by the same thresholds as the app.
  const level = (v) => (v >= 85 ? "#ff5a36" : v >= 70 ? "#ffd60a" : "#27e8ff");
  document.querySelectorAll("svg[data-gauge]").forEach((svg) => {
    const v = Number(svg.dataset.gauge), n = 24, r = 48;
    let on = "", off = "";
    for (let i = 0; i < n; i++) {
      const t0 = 135 + (i * 270) / n, t1 = t0 + (270 / n) * 0.62;
      const p = (t) => [60 + r * Math.cos((t * Math.PI) / 180), 60 + r * Math.sin((t * Math.PI) / 180)];
      const [x0, y0] = p(t0), [x1, y1] = p(t1);
      const s = `M${f(x0)} ${f(y0)}A${r} ${r} 0 0 1 ${f(x1)} ${f(y1)}`;
      if (i < Math.round((v / 100) * n)) on += s; else off += s;
    }
    svg.querySelector(".off").setAttribute("d", off);
    const live = svg.querySelector(".on");
    live.setAttribute("d", on);
    live.setAttribute("stroke", level(v));
  });

  // Spectrum: a day of CPU load as bars.
  let sw = "", sc = "";
  for (let i = 0; i < 140; i++) {
    const x = 4 + i * 4.25;
    const v = 0.2 + 0.6 * Math.abs(Math.sin(i / 10) * Math.cos(i / 27)) + (0.2 * ((i * 7919) % 13)) / 13;
    const d = `M${f(x)} 88V${f(88 - v * 84)}`;
    if (v > 0.8) sc += d; else sw += d;
  }
  set("spec-wire", sw);
  set("spec-cyan", sc);

  // Contour: a week of CPU load as ridgelines, today in cyan.
  let back = "", front = "";
  for (let d = 0; d < 7; d++) {
    const base = 120 + d * 34;
    let p = `M0 ${base}`;
    for (let x = 0; x <= 1440; x += 16) {
      const v = Math.exp(-Math.pow((x - 1000 - d * 20) / 260, 2)) * (0.6 + 0.2 * Math.sin(d * 1.7)) + 0.1 * Math.abs(Math.sin(x / 41 + d));
      p += `L${x} ${f(base - v * 110)}`;
    }
    if (d === 6) front = p; else back += p;
  }
  set("ridges-back", back);
  set("ridges-front", front);
})();
