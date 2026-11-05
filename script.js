const svg = document.getElementById("canvas");
const N = 30; // عدد الأجزاء
const elems = [];

for (let i = 0; i < N; i++) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "use");
  path.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#shape");
  svg.appendChild(path);
  elems.push({ e: path, x: 400, y: 400 });
}

const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
defs.innerHTML = `
  <path id="shape" d="M0,0 C5,-10 5,10 0,0" stroke="#b7e3c5" fill="none" stroke-width="2"/>
`;
svg.prepend(defs);

const pointer = { x: 400, y: 400 };
document.addEventListener("pointermove", (e) => {
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse());
  pointer.x = p.x;
  pointer.y = p.y;
});

let frm = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const toggle = document.getElementById("toggle");
function updateToggle() { toggle.textContent = paused ? "Resume animation" : "Pause animation"; toggle.setAttribute("aria-pressed", String(paused)); }
toggle.addEventListener("click", () => { paused = !paused; updateToggle(); });
updateToggle();
const run = () => {
  requestAnimationFrame(run);
  if (paused || document.hidden) return;
  frm += 0.01;

  let e = elems[0];
  const rad = 1;
  const ax = (Math.cos(3 * frm) * rad * 800) / 800;
  const ay = (Math.sin(4 * frm) * rad * 800) / 800;
  e.x += (ax + pointer.x - e.x) / 10;
  e.y += (ay + pointer.y - e.y) / 10;

  for (let i = 1; i < N; i++) {
    let e = elems[i];
    let ep = elems[i - 1];
    const a = Math.atan2(e.y - ep.y, e.x - ep.x);
    e.x += (ep.x - e.x + Math.cos(a) * (100 - i)) / 5;
    e.y += (ep.y - e.y + Math.sin(a) * (100 - i)) / 4;

    const s = (162 + 4 * (1 - i)) / 50;
    e.e.setAttributeNS(null, "transform", 
      `translate(${(ep.x + e.x) / 2}, ${(ep.y + e.y) / 2}) rotate(${(180 / Math.PI) * a})`
    );
  }
};

run();
