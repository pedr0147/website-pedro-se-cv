export function startBgCode() {
  const canvas = document.getElementById("bgCode");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const chars = "01<>/{}[]()$#@*+-=ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let w = 0, h = 0, dpr = 1, fontSize = 14, cols = 0, drops = [];
  let last = 0;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = window.innerWidth;
    h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    fontSize = Math.max(12, Math.min(16, Math.floor(w / 90)));
    cols = Math.floor(w / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * h);

    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
  }

  function frame(ts) {
    if (ts - last < 33) return requestAnimationFrame(frame);
    last = ts;

    ctx.fillStyle = "rgba(11,15,23,0.10)";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(150,200,255,0.65)";
    for (let i = 0; i < cols; i++) {
      const x = i * fontSize;
      const y = drops[i];
      const ch = chars[(Math.random() * chars.length) | 0];
      ctx.fillText(ch, x, y);

      drops[i] = y + fontSize * (0.6 + Math.random() * 0.9);
      if (drops[i] > h && Math.random() > 0.985) drops[i] = -fontSize;
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();
  requestAnimationFrame(frame);
}
