(() => {
  "use strict";

  // ==========================================
  // ELEMENTOS DEL DOM
  // ==========================================

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

  const frameCounter = document.querySelector("#frameCounter");

  const nameError = document.querySelector("#nameError");

  const gameStatus = document.querySelector("#gameStatus");

  const gameMessage = document.querySelector("#gameMessage");

  // ==========================================
  // ESTADO PRIVADO
  // ==========================================

  let score = 0;

  let timeRemaining = 30;

  let elapsedGameTime = 0;

  let isRunning = false;

  let animationFrameId = null;

  let lastTimestamp = 0;

  let frameCount = 0;

  let fps = 0;

  let fpsFrameCount = 0;

  let fpsLastTimestamp = 0;

  /*
   * CLOSURE:
   *
   * Las funciones definidas dentro de esta IIFE
   * mantienen acceso al estado privado del juego.
   *
   * Por ejemplo, gameLoop() puede acceder a
   * score, isRunning, lastTimestamp y frameCount.
   *
   * Estas variables conservan su estado entre las
   * diferentes ejecuciones de requestAnimationFrame().
   */

  // ==========================================
  // PELOTA
  // ==========================================

  const ball = {
    x: canvas.width / 2,

    y: canvas.height / 2,

    radius: Number(sizeInput.value),

    velocityX: Number(speedInput.value),

    velocityY: Number(speedInput.value) * 0.7,
  };

  // ==========================================
  // DIBUJAR
  // ==========================================

  const drawBall = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Barra superior

    ctx.fillStyle = "#dbeafe";

    ctx.fillRect(0, 0, canvas.width, 45);

    ctx.fillStyle = "#1e3a8a";

    ctx.font = "bold 18px Arial";

    ctx.fillText("🎯 ¡Haz clic sobre la pelota!", 20, 29);

    // Pelota

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fillStyle = "#2563eb";

    ctx.fill();

    // Borde

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.strokeStyle = "#1e3a8a";

    ctx.lineWidth = 3;

    ctx.stroke();
  };

  // ==========================================
  // VALIDAR NOMBRE
  // ==========================================

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

  // ==========================================
  // ACTUALIZAR VELOCIDAD
  // ==========================================

  const updateSpeed = () => {
    const speed = Number(speedInput.value);

    speedValue.textContent = speed;

    const directionX = ball.velocityX >= 0 ? 1 : -1;

    const directionY = ball.velocityY >= 0 ? 1 : -1;

    ball.velocityX = speed * directionX;

    ball.velocityY = speed * 0.7 * directionY;
  };

  // ==========================================
  // ACTUALIZAR TAMAÑO
  // ==========================================

  const updateSize = () => {
    const size = Number(sizeInput.value);

    sizeValue.textContent = size;

    ball.radius = size;
  };

  // ==========================================
  // CAMBIAR TEMA
  // ==========================================

  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
  };

  // ==========================================
  // MOVER PELOTA
  // ==========================================

  const moveBallToRandomPosition = () => {
    const margin = ball.radius;

    ball.x = margin + Math.random() * (canvas.width - margin * 2);

    ball.y = 45 + margin + Math.random() * (canvas.height - 45 - margin * 2);
  };

  // ==========================================
  // ACTUALIZAR PELOTA
  // ==========================================

  const updateBall = (dt) => {
    ball.x += ball.velocityX * dt;

    ball.y += ball.velocityY * dt;

    // Rebote horizontal

    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
      ball.velocityX *= -1;
    }

    // Rebote vertical

    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 45) {
      ball.velocityY *= -1;
    }
  };

  // ==========================================
  // FPS
  // ==========================================

  const updateFPS = (timestamp) => {
    fpsFrameCount++;

    const elapsed = timestamp - fpsLastTimestamp;

    if (elapsed >= 1000) {
      fps = fpsFrameCount;

      fpsFrameCount = 0;

      fpsLastTimestamp = timestamp;

      fpsElement.textContent = fps;
    }
  };

  // ==========================================
  // FINALIZAR
  // ==========================================

  const endGame = () => {
    isRunning = false;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;
    }

    gameStatus.textContent = "Estado: terminado";

    gameMessage.textContent = `🏆 Juego terminado. Puntaje final: ${score}`;

    startButton.textContent = "▶ Iniciar";
  };

  // ==========================================
  // LOOP PRINCIPAL
  // ==========================================

  const gameLoop = (timestamp) => {
    if (!isRunning) {
      return;
    }

    if (lastTimestamp === 0) {
      lastTimestamp = timestamp;

      fpsLastTimestamp = timestamp;
    }

    /*
     * Delta Time:
     *
     * Convertimos los milisegundos
     * transcurridos entre frames a segundos.
     */

    const dt = (timestamp - lastTimestamp) / 1000;

    lastTimestamp = timestamp;

    // Tiempo total del juego

    elapsedGameTime += dt;

    timeRemaining = Math.max(0, 30 - Math.floor(elapsedGameTime));

    timeElement.textContent = timeRemaining;

    if (timeRemaining <= 0) {
      endGame();

      return;
    }

    // Actualizar

    updateBall(dt);

    // Dibujar

    drawBall();

    // Frames

    frameCount++;

    frameCounter.textContent = frameCount;

    // FPS

    updateFPS(timestamp);

    /*
     * requestAnimationFrame()
     * solicita el siguiente frame
     * de la animación.
     */

    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // ==========================================
  // INICIAR
  // ==========================================

  const startGame = () => {
    if (isRunning) {
      return;
    }

    if (!validatePlayerName()) {
      return;
    }

    isRunning = true;

    lastTimestamp = 0;

    fpsLastTimestamp = 0;

    gameStatus.textContent = "Estado: ejecutándose";

    gameMessage.textContent = "🎯 ¡Haz clic sobre la pelota!";

    startButton.textContent = "⏸ Pausar";

    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // ==========================================
  // PAUSAR
  // ==========================================

  const pauseGame = () => {
    isRunning = false;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;
    }

    gameStatus.textContent = "Estado: pausado";

    startButton.textContent = "▶ Continuar";
  };

  // ==========================================
  // REINICIAR
  // ==========================================

  const resetGame = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;
    }

    isRunning = false;

    score = 0;

    timeRemaining = 30;

    elapsedGameTime = 0;

    frameCount = 0;

    fps = 0;

    fpsFrameCount = 0;

    lastTimestamp = 0;

    fpsLastTimestamp = 0;

    scoreElement.textContent = "0";

    timeElement.textContent = "30";

    fpsElement.textContent = "0";

    frameCounter.textContent = "0";

    gameStatus.textContent = "Estado: detenido";

    gameMessage.textContent = 'Ingresa tu nombre y presiona "Iniciar".';

    startButton.textContent = "▶ Iniciar";

    ball.x = canvas.width / 2;

    ball.y = canvas.height / 2;

    updateSpeed();

    updateSize();

    drawBall();
  };

  // ==========================================
  // CLICK SOBRE CANVAS
  // ==========================================

  const handleCanvasClick = (event) => {
    if (!isRunning) {
      return;
    }

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;

    const scaleY = canvas.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;

    const mouseY = (event.clientY - rect.top) * scaleY;

    const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);

    if (distance <= ball.radius) {
      score++;

      scoreElement.textContent = score;

      moveBallToRandomPosition();

      gameMessage.textContent = "🎉 ¡Acierto! +1 punto";
    }
  };

  // ==========================================
  // EVENTOS
  // ==========================================

  startButton.addEventListener("click", () => {
    if (isRunning) {
      pauseGame();
    } else {
      startGame();
    }
  });

  resetButton.addEventListener("click", () => {
    resetGame();
  });

  themeButton.addEventListener("click", () => {
    toggleTheme();
  });

  playerName.addEventListener("input", () => {
    validatePlayerName();
  });

  speedInput.addEventListener("input", () => {
    updateSpeed();
  });

  sizeInput.addEventListener("input", () => {
    updateSize();

    drawBall();
  });

  canvas.addEventListener("click", (event) => {
    handleCanvasClick(event);
  });

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  updateSpeed();

  updateSize();

  resetGame();
})();
