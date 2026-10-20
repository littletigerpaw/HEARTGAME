const gate = document.getElementById("gate");
const loveWorld = document.getElementById("loveWorld");
const heartsField = document.getElementById("heartsField");
const enterBtn = document.getElementById("enterBtn");
const spawnBtn = document.getElementById("spawnBtn");
const scoreText = document.getElementById("scoreText");
const winMessage = document.getElementById("winMessage");

let ambientTimer = null;
let gameTimer = null;
let score = 0;
const GOAL = 7;
const SPAWN_INTERVAL_MS = 500;
const GAME_DURATION_SECONDS = 33;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createHeart({ tappable = false } = {}) {
  const heart = document.createElement("div");
  heart.className = tappable ? "heart tap" : "heart ambient";
  heart.style.left = `${randomBetween(5, 95)}vw`;
  heart.style.bottom = `${randomBetween(-8, 12)}vh`;
  heart.style.background = `hsl(${randomBetween(335, 12)}, 95%, ${randomBetween(66, 78)}%)`;
  heart.style.animationDuration = `${randomBetween(4.2, 8.2)}s`;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const minSize = tappable ? (isMobile ? 30 : 24) : 14;
  const maxSize = tappable ? (isMobile ? 44 : 34) : 24;
  heart.style.width = `${randomBetween(minSize, maxSize)}px`;
  heart.style.height = heart.style.width;
  heart.style.zIndex = tappable ? "6" : "1";

  if (tappable) {
    heart.tabIndex = 0;

    const collectHeart = () => {
      if (heart.dataset.collected === "true") {
        return;
      }

      heart.dataset.collected = "true";
      score += 1;
      scoreText.textContent = `Hearts Collected: ${score} / ${GOAL}`;
      heart.remove();

      if (score >= GOAL) {
        endGame(true);
      }
    };

    heart.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      collectHeart();
    });

    heart.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        collectHeart();
      }
    });
  }

  heartsField.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 9000);
}

function startAmbientHearts() {
  if (ambientTimer) {
    clearInterval(ambientTimer);
  }

  ambientTimer = setInterval(() => {
    createHeart();
  }, 320);
}

function stopAmbientHearts() {
  clearInterval(ambientTimer);
  ambientTimer = null;
}

function endGame(won) {
  clearInterval(gameTimer);
  gameTimer = null;
  spawnBtn.disabled = false;
  spawnBtn.textContent = "Play Again";

  winMessage.textContent = won
    ? "You caught every heart. I love you forever, Chelseataka."
    : "Time is up, pretty girl. Try again and steal my heart.";
}

function startGame() {
  if (gameTimer) {
    return;
  }

  score = 0;
  scoreText.textContent = `Hearts Collected: ${score} / ${GOAL}`;
  winMessage.textContent = "";
  spawnBtn.disabled = true;
  spawnBtn.textContent = "Collecting...";

  let ticks = 0;
  const maxTicks = Math.floor((GAME_DURATION_SECONDS * 1000) / SPAWN_INTERVAL_MS);
  gameTimer = setInterval(() => {
    createHeart({ tappable: true });
    ticks += 1;

    // End game after configured duration.
    if (ticks >= maxTicks) {
      endGame(score >= GOAL);
    }
  }, SPAWN_INTERVAL_MS);
}

enterBtn.addEventListener("click", () => {
  gate.classList.remove("active");
  loveWorld.classList.add("active");
  loveWorld.setAttribute("aria-hidden", "false");
  startAmbientHearts();
});

spawnBtn.addEventListener("click", startGame);
