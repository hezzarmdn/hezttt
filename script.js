const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["","","","","","","","",""];
let gameActive = true;
let playerTurn = true; // 🔒 kunci giliran

const PLAYER = "X";
const AI = "O";

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

cells.forEach(cell => {
  cell.addEventListener("touchstart", playerMove);
  cell.addEventListener("click", playerMove);
});

function playerMove(e) {
  e.preventDefault();
  const index = e.target.dataset.index;

  // ❌ blok spam
  if (!gameActive || !playerTurn || board[index] !== "") return;

  playerTurn = false; // 🔒 kunci input
  makeMove(index, PLAYER);

  if (checkWin(PLAYER)) {
    statusText.textContent = "LU MENANG 🎉";
    gameActive = false;
    spawnParticles("limegreen");
    return;
  }

  if (isDraw()) {
    statusText.textContent = "SERI 🤝";
    gameActive = false;
    return;
  }

  statusText.textContent = "AI mikir...";
  setTimeout(aiMove, 600);
}

function aiMove() {
  if (!gameActive) return;

  const move = findBestMove();
  makeMove(move, AI);

  if (checkWin(AI)) {
    statusText.textContent = "LU KALAH 💀";
    gameActive = false;
    spawnParticles("red");
    return;
  }

  if (isDraw()) {
    statusText.textContent = "SERI 🤝";
    gameActive = false;
    return;
  }

  playerTurn = true; // 🔓 buka input
  statusText.textContent = "Giliran lu (X)";
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add("pop", player === PLAYER ? "x" : "o");

  setTimeout(() => {
    cells[index].classList.remove("pop");
  }, 300);
}

function checkWin(player) {
  for (let pattern of winPatterns) {
    if (pattern.every(i => board[i] === player)) {
      pattern.forEach(i => cells[i].classList.add("win"));
      return true;
    }
  }
  return false;
}

function isDraw() {
  return board.every(cell => cell !== "");
}

function findBestMove() {
  // menang
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = AI;
      if (checkWin(AI)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // blok
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = PLAYER;
      if (checkWin(PLAYER)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  // random
  const empty = board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  return empty[Math.floor(Math.random() * empty.length)];
}

function resetGame() {
  board = ["","","","","","","","",""];
  gameActive = true;
  playerTurn = true;
  statusText.textContent = "Giliran lu (X)";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
  });
}

/* ===== PARTICLE ===== */
function spawnParticles(color) {
  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.backgroundColor = color;

    const x = (Math.random() - 0.5) * 400 + "px";
    const y = (Math.random() - 0.5) * 400 + "px";

    p.style.setProperty("--x", x);
    p.style.setProperty("--y", y);

    p.style.left = "50%";
    p.style.top = "50%";

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}
