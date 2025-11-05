const goblinLayer = document.querySelector('.goblin-layer');
const goblinImage = "emote_goblin_boohoo.png"; // make sure this file is in the same folder
const maxGoblins = 25; // how many appear at once

function spawnGoblin() {
  const img = document.createElement("img");
  img.src = G_IMAGE;
  img.className = "goblin";

  img.style.left = Math.random() * (window.innerWidth - 90) + "px";
  img.style.animationDuration = (3500 + Math.random() * 2500) + "ms";

  document.body.appendChild(img);
  active.add(img);

  const check = setInterval(() => {
    if (!img.parentNode) { clearInterval(check); active.delete(img); return; }

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

// Touch controls (phone)
window.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  mortar.style.left = touchX - mortar.offsetWidth / 2 + "px";
});

// run continuously
setInterval(spawnGoblin, 350);