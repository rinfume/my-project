const G_IMAGE = "emote_goblin_boohoo.png";

const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const endScreen = document.getElementById("end-screen");
const finishBtn = document.getElementById("finish-btn");
const restartBtn = document.getElementById("restart-btn");
const mortar = document.getElementById("mortar");
const fullscreenBtn = document.getElementById("fullscreen-btn");

let score = 0;
let spawnTimer;
let active = new Set();

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function spawnGoblin() {
  const img = document.createElement("img");
  img.src = G_IMAGE;
  img.className = "goblin";

  img.style.left = Math.random() * (window.innerWidth - 60) + "px";
  img.style.animationDuration = (3500 + Math.random() * 2500) + "ms";

  document.body.appendChild(img);
  active.add(img);

  const check = setInterval(() => {
    if (!img.parentNode) {
      clearInterval(check);
      active.delete(img);
      return;
    }

    const g = img.getBoundingClientRect();
    const m = mortar.getBoundingClientRect();

    if (g.bottom >= m.top && g.left < m.right && g.right > m.left) {
      score++;
      scoreEl.textContent = score;
      img.remove();
      active.delete(img);
      clearInterval(check);
    }

    if (g.top > window.innerHeight + 50) {
      img.remove();
      active.delete(img);
      clearInterval(check);
    }
  }, 60);
}

function startGame() {
  clearInterval(spawnTimer);
  active.forEach(g => g.remove());
  active.clear();
  spawnTimer = setInterval(spawnGoblin, 800);
}

startGame();

finishBtn.onclick = () => {
  clearInterval(spawnTimer);
  active.forEach(g => g.remove());
  active.clear();
  finalScoreEl.textContent = score;
  endScreen.style.display = "block";
};

restartBtn.onclick = () => {
  score = 0;
  scoreEl.textContent = score;
  endScreen.style.display = "none";
  startGame();
};

/* PC Mouse */
document.addEventListener("mousemove", e => {
  mortar.style.left = clamp(e.clientX - mortar.offsetWidth / 2, 0, window.innerWidth - mortar.offsetWidth) + "px";
});

/* Mobile Touch */
document.addEventListener("touchmove", e => {
  const x = e.touches[0].clientX;
  mortar.style.left = clamp(x - mortar.offsetWidth / 2, 0, window.innerWidth - mortar.offsetWidth) + "px";
});

/* Fullscreen button logic */
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((e) => {
      alert(`Не вдалося увімкнути повноекранний режим: ${e.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

/* Перезапуск падіння гоблінів після зміни орієнтації */
window.addEventListener('resize', () => {
  // Очистити старих гоблінів
  active.forEach(g => g.remove());
  active.clear();

  // Запустити заново падіння
  startGame();
});
