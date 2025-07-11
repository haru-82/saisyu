const shapes = [
  { id: "square", symbol: "⬜" },
  { id: "circle", symbol: "⚪" },
  { id: "triangle", symbol: "🔺" },
  { id: "star", symbol: "⭐" },
  { id: "heart", symbol: "❤️" }
];

let currentStage = 0;
let score = 0;
let timeLeft = 0;
let correctId = "";
let timer = null;
let maxStages = 5;
let difficulty = "normal";
let gameState = "waiting";

const slot = document.getElementById("slot");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const stageDisplay = document.getElementById("stage");
const result = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const blocksContainer = document.getElementById("blocks");


function getTimeLimit() {
  switch (difficulty) {
    case "easy": return 20;
    case "hard": return 10;
    default: return 15;
  }
}

function shuffleBlocks() {
  const children = Array.from(blocksContainer.children);
  for (let i = children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    blocksContainer.appendChild(children[j]);
  }
}

function updateTimerDisplay() {
  timerDisplay.textContent = `のこり: ${timeLeft}秒`;
}

function startStage() {
  if (gameState !== "playing") return;

  if (currentStage > maxStages) {
    endGame();
    return;
  }

  timeLeft = getTimeLimit();
  result.textContent = "";
  stageDisplay.textContent = `${currentStage} / ${maxStages}`;

  const random = shapes[Math.floor(Math.random() * shapes.length)];
  correctId = random.id;
  slot.textContent = random.symbol;

  updateTimerDisplay();

  if (timer !== null) {
    clearInterval(timer);
  }
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      result.textContent = "じかんぎれ！";
      currentStage++;
      setTimeout(() => {
        if (gameState === "playing") startStage();
      }, 1000);
    }
  }, 1000);

  shuffleBlocks();
}


function drag(event) {
  if (gameState !== "playing") {
    event.preventDefault();
    return;
  }
  event.dataTransfer.setData("text", event.target.id);
}

function dropHandler(event) {
  event.preventDefault();
  if (gameState !== "playing") return;

  const shapeId = event.dataTransfer.getData("text");

  if (shapeId === correctId) {
    clearInterval(timer);
    timer = null;

    const gained = timeLeft * 10;
    score += gained;
    scoreDisplay.textContent = `スコア: ${score}`;
    result.textContent = `せいかい！ +${gained}点`;

    currentStage++;
    setTimeout(() => {
      if (gameState === "playing") startStage();
    }, 1000);
  } else {
    result.textContent = "ちがうよ〜";
  }
}


function endGame() {
  gameState = "ended";
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  result.innerHTML = `ゲーム終了！<br>あなたのスコアは ${score} 点！`;
}


function startGame() {
  if (gameState === "playing") return;

  maxStages = parseInt(document.getElementById("stageCount").value);
  difficulty = document.getElementById("difficulty").value;

  currentStage = 1;
  score = 0;
  gameState = "playing";

  scoreDisplay.textContent = "スコア: 0";
  result.textContent = "";
  startStage();
}


restartBtn.addEventListener("click", startGame);

slot.addEventListener("dragover", event => {
  event.preventDefault();
});

slot.addEventListener("drop", dropHandler);

document.querySelectorAll(".draggable").forEach(item =>
  item.addEventListener("dragstart", drag)
);