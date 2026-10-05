
import "./style.css";

const totalPages = 10;
let current = 1;
let isFullscreen = false;

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="site">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">Py</div>
        <div>
          <div class="brand-title">Python Interview Questions</div>
          <div class="brand-subtitle">Book Edition · 10 Pages</div>
        </div>
      </div>

      <div class="top-actions">
        <button class="icon-btn" id="firstBtn" title="First page">«</button>
        <button class="icon-btn" id="prevBtn" title="Previous page">‹</button>
        <span class="page-counter"><b id="pageNo">1</b> / ${totalPages}</span>
        <button class="icon-btn" id="nextBtn" title="Next page">›</button>
        <button class="icon-btn" id="lastBtn" title="Last page">»</button>
        <button class="icon-btn" id="fullscreenBtn" title="Fullscreen">⛶</button>
      </div>
    </header>

    <main class="reader">
      <aside class="sidebar">
        <div class="sidebar-title">Contents</div>
        <div class="progress"><span id="progress"></span></div>
        <div class="thumbs" id="thumbs"></div>
        <div class="tip">
          <strong>Keyboard</strong>
          <span>← →</span> turn pages<br />
          <span>Home / End</span> jump<br />
          <span>F</span> fullscreen
        </div>
      </aside>

      <section class="book-area">
        <div class="book-shadow"></div>
        <div class="book" id="book">
          <div class="page" id="page">
            <div class="paper">
              <img id="pageImage" src="/pages/page-1.webp" alt="Python Interview Questions page 1" draggable="false" />
            </div>
          </div>
        </div>

        <div class="book-controls">
          <button class="control-btn" id="zoomOut">−</button>
          <span id="zoomLabel">100%</span>
          <button class="control-btn" id="zoomIn">+</button>
          <button class="control-btn" id="resetZoom">Reset</button>
        </div>
        <p class="hint">Click the page or use the arrows to read the book</p>
      </section>
    </main>

    <footer>
      <span>Python Interview Questions</span>
      <span>Made for interview preparation</span>
    </footer>
  </div>
`;

const pageImage = document.querySelector("#pageImage");
const page = document.querySelector("#page");
const pageNo = document.querySelector("#pageNo");
const progress = document.querySelector("#progress");
const thumbs = document.querySelector("#thumbs");
const zoomLabel = document.querySelector("#zoomLabel");

for (let i = 1; i <= totalPages; i++) {
  const button = document.createElement("button");
  button.className = "thumb";
  button.dataset.page = i;
  button.innerHTML = `
    <span class="thumb-number">${i}</span>
    <img src="/pages/page-${i}.webp" alt="Page ${i}" loading="lazy" />
  `;
  button.addEventListener("click", () => goTo(i));
  thumbs.appendChild(button);
}

let zoom = 1;

function updateUI() {
  pageNo.textContent = current;
  progress.style.width = `${(current / totalPages) * 100}%`;

  document.querySelectorAll(".thumb").forEach((el) => {
    el.classList.toggle("active", Number(el.dataset.page) === current);
  });

  document.querySelector("#prevBtn").disabled = current === 1;
  document.querySelector("#firstBtn").disabled = current === 1;
  document.querySelector("#nextBtn").disabled = current === totalPages;
  document.querySelector("#lastBtn").disabled = current === totalPages;

  pageImage.alt = `Python Interview Questions page ${current}`;
  pageImage.src = `/pages/page-${current}.webp`;

  pageImage.style.transform = `scale(${zoom})`;
  zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
}

function goTo(n, direction = null) {
  n = Math.max(1, Math.min(totalPages, n));
  if (n === current) return;

  const old = current;
  current = n;
  const dir = direction || (n > old ? "next" : "prev");

  page.classList.remove("turn-next", "turn-prev");
  void page.offsetWidth;
  page.classList.add(dir === "next" ? "turn-next" : "turn-prev");

  setTimeout(() => {
    updateUI();
    page.classList.remove("turn-next", "turn-prev");
  }, 260);
}

function next() {
  if (current < totalPages) goTo(current + 1, "next");
}

function prev() {
  if (current > 1) goTo(current - 1, "prev");
}

document.querySelector("#nextBtn").addEventListener("click", next);
document.querySelector("#prevBtn").addEventListener("click", prev);
document.querySelector("#firstBtn").addEventListener("click", () => goTo(1));
document.querySelector("#lastBtn").addEventListener("click", () => goTo(totalPages));

page.addEventListener("click", (e) => {
  if (e.target.closest("img")) {
    const rect = page.getBoundingClientRect();
    if (e.clientX > rect.left + rect.width / 2) next();
    else prev();
  }
});

document.querySelector("#zoomIn").addEventListener("click", () => {
  zoom = Math.min(1.6, +(zoom + 0.1).toFixed(2));
  updateUI();
});

document.querySelector("#zoomOut").addEventListener("click", () => {
  zoom = Math.max(0.7, +(zoom - 0.1).toFixed(2));
  updateUI();
});

document.querySelector("#resetZoom").addEventListener("click", () => {
  zoom = 1;
  updateUI();
});

async function toggleFullscreen() {
  const reader = document.querySelector(".reader");
  if (!document.fullscreenElement) {
    await reader.requestFullscreen?.();
    isFullscreen = true;
  } else {
    await document.exitFullscreen?.();
    isFullscreen = false;
  }
}

document.querySelector("#fullscreenBtn").addEventListener("click", toggleFullscreen);

document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

  if (e.key === "ArrowRight" || e.key === "PageDown") {
    e.preventDefault();
    next();
  } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
    e.preventDefault();
    prev();
  } else if (e.key === "Home") {
    e.preventDefault();
    goTo(1);
  } else if (e.key === "End") {
    e.preventDefault();
    goTo(totalPages);
  } else if (e.key.toLowerCase() === "f") {
    e.preventDefault();
    toggleFullscreen();
  } else if (e.key === "+" || e.key === "=") {
    zoom = Math.min(1.6, +(zoom + 0.1).toFixed(2));
    updateUI();
  } else if (e.key === "-") {
    zoom = Math.max(0.7, +(zoom - 0.1).toFixed(2));
    updateUI();
  }
});

let touchStartX = 0;
page.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

page.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 45) dx < 0 ? next() : prev();
}, { passive: true });

updateUI();
