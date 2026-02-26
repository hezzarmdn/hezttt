* {
  box-sizing: border-box;
}

body {
  text-align: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin-top: 40px;
  background: #fafafa;
}

/* Judul */
h2 {
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* Status */
#status {
  font-weight: 700;
  font-size: 16px;
  margin-top: 6px;
}

/* Board */
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 90vw;
  max-width: 320px;
  margin: 20px auto;
}

/* Cell */
.cell {
  aspect-ratio: 1 / 1;
  background: #f1f1f1;
  font-size: 64px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  user-select: none;
  transition: transform 0.15s ease, background 0.2s ease;
}

.cell:active {
  transform: scale(0.95);
}

/* Animasi muncul */
.cell.pop {
  animation: pop 0.25s ease-out;
}

@keyframes pop {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Warna */
.cell.x {
  color: #3b82f6;
}

.cell.o {
  color: #ef4444;
}

/* Menang glow */
.cell.win {
  background: #d1fae5;
  animation: glow 0.6s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 6px rgba(16,185,129,0.3);
  }
  to {
    box-shadow: 0 0 14px rgba(16,185,129,0.6);
  }
}

/* Tombol */
button {
  padding: 10px 22px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  background: #3b82f6;
  color: white;
}

/* ===== PARTICLE EFFECT ===== */
.particle {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  animation: explode 1s ease-out forwards;
}

@keyframes explode {
  from {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
}
