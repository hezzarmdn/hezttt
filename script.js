const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const diffButtons = document.querySelectorAll(".diff");

let board = Array(9).fill("");
let gameActive = true;
let playerTurn = true;
let difficulty = "easy";

const PLAYER = "X";
const AI = "O";

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

diffButtons.forEach(btn => {
  btn.onclick = () => {
    diffButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.diff;
    resetGame();
  };
});

cells.forEach(c => {
  c.addEventListener("touchstart", playerMove);
  c.addEventListener("click", playerMove);
});

function playerMove(e) {
  e.preventDefault();
  const i = e.target.dataset.index;
  if (!gameActive || !playerTurn || board[i]) return;

  playerTurn = false;
  place(i, PLAYER);

  if (checkWin(PLAYER)) {
    endGame("Kamu menang 🎉", "#22c55e");
    return;
  }

  if (isDraw()) {
    endGame("Seri 🤝", "#38bdf8");
    return;
  }

  statusText.textContent = "AI sedang berpikir...";
  setTimeout(aiMove, 600);
}

function aiMove() {
  const move = difficulty === "easy" ? randomMove() : smartMove();
  place(move, AI);

  if (checkWin(AI)) {
    endGame("Kamu kalah 💀", "#f43f5e");
    return;
  }

  if (isDraw()) {
    endGame("Seri 🤝", "#38bdf8");
    return;
  }

  playerTurn = true;
  statusText.textContent = "Giliran kamu (X)";
}

function place(i, p) {
  board[i] = p;
  cells[i].textContent = p;
  cells[i].classList.add("pop", p === PLAYER ? "x" : "o");
}

function checkWin(p) {
  for (let w of wins) {
    if (w.every(i => board[i] === p)) {
      w.forEach(i => cells[i].classList.add("win"));
      return true;
    }
  }
  return false;
}

function isDraw() {
  return board.every(v => v);
}

function randomMove() {
  const e = board.map((v,i)=>v?null:i).filter(v=>v!==null);
  return e[Math.floor(Math.random()*e.length)];
}

function smartMove() {
  for (let i=0;i<9;i++){
    if(!board[i]){ board[i]=AI; if(checkWin(AI)){board[i]=""; return i;} board[i]=""; }
  }
  for (let i=0;i<9;i++){
    if(!board[i]){ board[i]=PLAYER; if(checkWin(PLAYER)){board[i]=""; return i;} board[i]=""; }
  }
  if(!board[4]) return 4;
  return randomMove();
}

function endGame(text, color) {
  statusText.textContent = text;
  gameActive = false;
  spawnParticles(color);
}

function resetGame() {
  board.fill("");
  gameActive = true;
  playerTurn = true;
  statusText.textContent = "Giliran kamu (X)";
  cells.forEach(c => c.className="cell", c.textContent="");
}

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
