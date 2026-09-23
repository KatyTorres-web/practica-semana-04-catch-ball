/*
 * CATCH THE BALL
 * Práctica Semana 04
 *
 * Paso 2:
 * IIFE + Closure + Arrow Functions + Canvas
 */

(() => {
  "use strict";

  // =========================================================
  // 1. ELEMENTOS DEL DOM
  // =========================================================

  const canvas = document.querySelector("#gameCanvas");

  const ctx = canvas.getContext("2d");

  const playerName = document.querySelector("#playerName");

  const playerDisplay = document.querySelector("#playerDisplay");

  const startButton = document.querySelector("#startButton");

  const resetButton = document.querySelector("#resetButton");

  const themeButton = document.querySelector("#themeButton");

  const speedInput = document.querySelector("#speedInput");

  const sizeInput = document.querySelector("#sizeInput");

  const speedValue = document.querySelector("#speedValue");

  const sizeValue = document.querySelector("#sizeValue");

  const scoreElement = document.querySelector("#score");

  const timeElement = document.querySelector("#time");

  const fpsElement = document.querySelector("#fps");

  const nameError = document.querySelector("#nameError");

  const gameStatus = document.querySelector("#gameStatus");

  const gameMessage = document.querySelector("#gameMessage");

  // =========================================================
  // 2. ESTADO PRIVADO DEL JUEGO
  // =========================================================

  /*
   * CLOSURE:
   *
   * Todas las funciones que creemos dentro de esta IIFE
   * podrán acceder a estas variables.
   *
   * Estas variables no están disponibles directamente
   * desde el ámbito global.
   *
   * Cuando posteriormente utilicemos
   * requestAnimationFrame(), funciones como gameLoop()
   * podrán seguir accediendo a este estado.
   *
   * Esto es posible gracias al closure.
   */

  let score = 0;

  let timeRemaining = 30;

  let isRunning = false;

  let animationFrameId = null;

  let lastTimestamp = 0;

  let frameCount = 0;

  let fps = 0;

  let fpsFrameCount = 0;

  let fpsLastTimestamp = 0;

  // =========================================================
  // 3. ESTADO DE LA PELOTA
  // =========================================================

  const ball = {
    x: canvas.width / 2,

    y: canvas.height / 2,

    radius: Number(sizeInput.value),

    velocityX: Number(speedInput.value),

    velocityY: Number(speedInput.value) * 0.7,
  };

  // =========================================================
  // 4. FUNCIÓN ARROW PARA ACTUALIZAR EL PUNTAJE
  // =========================================================

  const updateScore = () => {
    score++;

    scoreElement.textContent = score;
  };

  // =========================================================
  // 5. FUNCIÓN PARA DIBUJAR LA PELOTA
  // =========================================================

  const drawBall = () => {
    // -----------------------------------------------------
    // Limpiar Canvas
    // -----------------------------------------------------

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // -----------------------------------------------------
    // Fondo superior
    // -----------------------------------------------------

    ctx.fillStyle = "#dbeafe";

    ctx.fillRect(0, 0, canvas.width, 45);

    // -----------------------------------------------------
    // Texto del escenario
    // -----------------------------------------------------

    ctx.fillStyle = "#1e3a8a";

    ctx.font = "bold 18px Arial";

    ctx.fillText("🎯 ¡Haz clic sobre la pelota!", 20, 29);

    // -----------------------------------------------------
    // Pelota
    // -----------------------------------------------------

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#2563eb";

    ctx.fill();

    // -----------------------------------------------------
    // Borde de la pelota
    // -----------------------------------------------------

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.strokeStyle = "#1e3a8a";

    ctx.lineWidth = 3;

    ctx.stroke();
  };

  // =========================================================
  // 6. INICIALIZACIÓN DEL CANVAS
  // =========================================================

  drawBall();
})();


const validatePlayerName = () => {
  const name = playerName.value.trim();

  if (name.length === 0) {
    nameError.textContent = "El nombre es obligatorio.";

    playerName.classList.add("input-error");

    return false;
  }

  if (name.length < 3) {
    nameError.textContent = "El nombre debe tener al menos 3 caracteres.";

    playerName.classList.add("input-error");

    return false;
  }

  nameError.textContent = "";

  playerName.classList.remove("input-error");

  playerDisplay.textContent = name;

  return true;
};
playerName.addEventListener("input", () => {
  validatePlayerName();
});

const toggleTheme = () => {
  document.body.classList.toggle("dark-theme");
};
themeButton.addEventListener("click", () => {
  toggleTheme();
});
const updateSpeed = () => {
  const speed = Number(speedInput.value);

  speedValue.textContent = speed;

  const directionX = ball.velocityX >= 0 ? 1 : -1;

  const directionY = ball.velocityY >= 0 ? 1 : -1;

  ball.velocityX = speed * directionX;

  ball.velocityY = speed * 0.7 * directionY;
};
speedInput.addEventListener("input", () => {
  updateSpeed();
});
const updateSize = () => {
  const size = Number(sizeInput.value);

  sizeValue.textContent = size;

  ball.radius = size;
};
sizeInput.addEventListener("input", () => {
  updateSize();

  drawBall();
});

const updateBall = (dt) => {

    ball.x +=
        ball.velocityX * dt;


    ball.y +=
        ball.velocityY * dt;


    // Rebote horizontal

    if (
        ball.x + ball.radius >= canvas.width ||
        ball.x - ball.radius <= 0
    ) {

        ball.velocityX *= -1;

    }


    // Rebote vertical

    if (
        ball.y + ball.radius >= canvas.height ||
        ball.y - ball.radius <= 45
    ) {

        ball.velocityY *= -1;

    }

};