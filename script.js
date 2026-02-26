const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const diffButtons = document.querySelectorAll(".diff");

let board, gameActive, playerTurn, difficulty;

const PLAYER = "X";
const AI = "O";

const wins = [
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
  difficulty = "easy";
  statusText.textContent = "Giliran kamu (X)";
  cells.forEach(c => {
    c.textContent = "";
    c.className = "cell";
  });
}

/* ===== DIFFICULTY ===== */
diffButtons.forEach(btn => {
  btn.onclick = () => {
    diffButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.diff;
    init();
  };
});

/* ===== PLAYER MOVE ===== */
cells.forEach(cell => {
  cell.onclick = () => {
    const i = cell.dataset.index;
    if (!gameActive || !playerTurn || board[i]) return;

    place(i, PLAYER);

    if (checkEnd(PLAYER, "Kamu menang 🎉", "#22c55e")) return;

    playerTurn = false;
    statusText.textContent = "AI sedang berpikir...";
    setTimeout(aiMove, 500);
  };
});

/* ===== AI MOVE ===== */
function aiMove() {
  if (!gameActive) return;

  const move = difficulty === "easy" ? randomMove() : smartMove();
  place(move, AI);

  if (checkEnd(AI, "Kamu kalah 💀", "#f43f5e")) return;

  playerTurn = true;
  statusText.textContent = "Giliran kamu (X)";
}

/* ===== PLACE ===== */
function place(i, p) {
  board[i] = p;
  cells[i].textContent = p;
  cells[i].classList.add(p === PLAYER ? "x" : "o");
}

/* ===== CHECK END ===== */
function checkEnd(p, text, color) {
  if (checkWin(p)) {
    endGame(text, color);
    return true;
  }
  if (board.every(v => v)) {
    endGame("Seri 🤝", "#38bdf8");
    return true;
  }
  return false;
}

function checkWin(p) {
  return wins.some(w =>
    w.every(i => board[i] === p && cells[i].classList.add("win"))
  );
}

/* ===== AI LOGIC ===== */
function randomMove() {
  return board.map((v,i)=>v?null:i).filter(v=>v!==null)
    .sort(()=>Math.random()-0.5)[0];
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

/* ===== END GAME ===== */
function endGame(text, color) {
  gameActive = false;
  playerTurn = false;
  statusText.textContent = text;
  spawnParticles(color);
}

/* ===== RESET ===== */
resetBtn.onclick = init;

/* ===== PARTICLE ===== */
function spawnParticles(color) {
  for (let i=0;i<60;i++){
    const p=document.createElement("div");
    p.className="particle";
    p.style.background=color;
    p.style.left="50%";
    p.style.top="50%";
    p.style.setProperty("--x",(Math.random()-0.5)*500+"px");
    p.style.setProperty("--y",(Math.random()-0.5)*500+"px");
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),1000);
  }
}
