const boardEl = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const diffBtns = document.querySelectorAll(".difficulty button");

let board, gameActive, playerTurn, difficulty;

const PLAYER = "X";
const AI = "O";

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

init();

/* ===== INIT ===== */
function init() {
  board = Array(9).fill("");
  gameActive = true;
  playerTurn = true;
  statusText.textContent = "Giliran kamu (X)";
  renderBoard();
}

/* ===== RENDER BOARD ===== */
function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => handleMove(i);
    boardEl.appendChild(cell);
  });
}

/* ===== HANDLE MOVE ===== */
function handleMove(i) {
  if (!gameActive || !playerTurn || board[i]) return;

  place(i, PLAYER);
  if (endCheck(PLAYER, "Kamu menang 🎉", "#22c55e")) return;

  playerTurn = false;
  statusText.textContent = "AI sedang berpikir...";
  setTimeout(aiMove, 500);
}

/* ===== AI MOVE ===== */
function aiMove() {
  if (!gameActive) return;

  const move = difficulty === "hard" ? smartMove() : randomMove();
  place(move, AI);

  if (endCheck(AI, "Kamu kalah 💀", "#f43f5e")) return;

  playerTurn = true;
  statusText.textContent = "Giliran kamu (X)";
}

/* ===== PLACE ===== */
function place(i, p) {
  board[i] = p;
  const cell = boardEl.children[i];
  cell.textContent = p;
  cell.classList.add(p === PLAYER ? "x" : "o");
}

/* ===== END CHECK ===== */
function endCheck(p, text, color) {
  if (checkWin(p)) {
    finish(text, color);
    return true;
  }
  if (board.every(v => v)) {
    finish("Seri 🤝", "#38bdf8");
    return true;
  }
  return false;
}

function checkWin(p) {
  return winPatterns.some(pat => pat.every(i => board[i] === p));
}

/* ===== AI LOGIC ===== */
function randomMove() {
  return board.map((v,i)=>v?null:i).filter(v=>v!==null)
    [Math.floor(Math.random()*board.filter(v=>!v).length)];
}

function smartMove() {
  for (let i=0;i<9;i++){
    if(!board[i]){board[i]=AI;if(checkWin(AI)){board[i]="";return i;}board[i]="";}
  }
  for (let i=0;i<9;i++){
    if(!board[i]){board[i]=PLAYER;if(checkWin(PLAYER)){board[i]="";return i;}board[i]="";}
  }
  if(!board[4]) return 4;
  return randomMove();
}

/* ===== FINISH ===== */
function finish(text, color) {
  gameActive = false;
  playerTurn = false;
  statusText.textContent = text;
  spawnParticles(color);
}

/* ===== RESET ===== */
resetBtn.onclick = init;

/* ===== DIFFICULTY ===== */
difficulty = "easy";
diffBtns.forEach(btn => {
  btn.onclick = () => {
    diffBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.diff;
    init();
  };
});

/* ===== PARTICLES ===== */
function spawnParticles(color) {
  for (let i=0;i<60;i++){
    const p = document.createElement("div");
    p.className = "particle";
    p.style.background = color;
    p.style.left = "50%";
    p.style.top = "50%";
    p.style.setProperty("--x",(Math.random()-0.5)*500+"px");
    p.style.setProperty("--y",(Math.random()-0.5)*500+"px");
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),900);
  }
}
