/*
 * ========================================================
 * CATCH THE BALL
 * Práctica Semana 04
 * JavaScript + Canvas API
 *
 * Conceptos:
 * - IIFE
 * - Closure
 * - Arrow Functions
 * - DOM
 * - Canvas API
 * - requestAnimationFrame
 * - Delta Time (dt)
 * - Eventos
 * - Validación
 * ========================================================
 */

(() => {
  "use strict";

  // ========================================================
  // 1. ELEMENTOS DEL DOM
  // ========================================================

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

  const comboElement = document.querySelector("#combo");

  const nameError = document.querySelector("#nameError");

  const gameStatus = document.querySelector("#gameStatus");

  const gameMessage = document.querySelector("#gameMessage");

  // ========================================================
  // ELEMENTOS DE LOS PASOS
  // ========================================================

  const stepButtons = document.querySelectorAll(".step-button");

  const selectedStep = document.querySelector("#selectedStep");

  // ========================================================
  // 2. ESTADO PRIVADO
  // ========================================================

  /*
   * ========================================================
   * IIFE + CLOSURE
   * ========================================================
   *
   * Todas las variables están dentro de la IIFE.
   *
   * Las funciones creadas dentro de este ámbito mantienen
   * acceso a estas variables mediante Closure.
   *
   * Esto evita crear variables globales.
   */

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

  let combo = 0;

  /*
   * Paso actualmente seleccionado.
   */

  let currentStep = 1;

  // ========================================================
  // 3. PELOTA
  // ========================================================

  const ball = {
    x: canvas.width / 2,

    y: canvas.height / 2,

    radius: Number(sizeInput.value),

    velocityX: Number(speedInput.value),

    velocityY: Number(speedInput.value) * 0.7,

    color: "#2563eb",
  };

  // ========================================================
  // 4. FUNCIONALIDADES DE LOS PASOS
  // ========================================================

  /*
   * Cada paso activa una funcionalidad.
   *
   * Paso 1:
   * estructura e interfaz.
   *
   * Paso 2:
   * estado privado mediante IIFE + Closure.
   *
   * Paso 3:
   * interacción y manipulación del DOM.
   *
   * Paso 4:
   * Canvas y animación.
   *
   * Paso 5:
   * métricas de rendimiento.
   */

  // ========================================================
  // PASO 1
  // ========================================================

  const activateStep1 = () => {
    /*
     * El paso 1 corresponde a la estructura de la
     * aplicación y al Canvas.
     */

    drawBall();
  };

  // ========================================================
  // PASO 2
  // ========================================================

  const activateStep2 = () => {
    /*
     * El estado del juego ya está protegido dentro
     * de la IIFE.
     *
     * Las funciones utilizan Closure para acceder
     * a score, combo, tiempo, etc.
     */

    gameMessage.textContent =
      "Estado privado gestionado mediante IIFE y Closure.";
  };

  // ========================================================
  // PASO 3
  // ========================================================

  const activateStep3 = () => {
    /*
     * Se activa la interacción con el DOM.
     */

    validatePlayerName();

    updateSpeed();

    updateSize();
  };

  // ========================================================
  // PASO 4
  // ========================================================

  const activateStep4 = () => {
    /*
     * Paso dedicado al Canvas y a requestAnimationFrame.
     *
     * La animación se inicia utilizando el botón
     * "Iniciar".
     */

    drawBall();

    gameMessage.textContent = "Canvas y animación disponibles.";
  };

  // ========================================================
  // PASO 5
  // ========================================================

  const activateStep5 = () => {
    /*
     * Paso dedicado a las métricas de rendimiento.
     */

    fpsElement.parentElement.classList.add("performance-active");

    frameCounter.parentElement.classList.add("performance-active");

    gameMessage.textContent = "Métricas de FPS y frames activadas.";
  };

  // ========================================================
  // 5. ACTIVAR PASO
  // ========================================================

  const activateStep = (stepNumber) => {
    /*
     * Guardamos el paso seleccionado.
     *
     * Gracias al Closure, currentStep permanece disponible
     * para las funciones que se ejecuten posteriormente.
     */

    currentStep = stepNumber;

    // ------------------------------------------------------
    // Actualizar selección visual
    // ------------------------------------------------------

    stepButtons.forEach((button) => {
      const buttonStep = Number(button.dataset.step);

      button.classList.toggle("active", buttonStep === stepNumber);
    });

    // ------------------------------------------------------
    // Mostrar número seleccionado
    // ------------------------------------------------------

    selectedStep.textContent = stepNumber;

    // ------------------------------------------------------
    // Limpiar estados anteriores
    // ------------------------------------------------------

    document.body.classList.remove(
      "step-1-active",
      "step-2-active",
      "step-3-active",
      "step-4-active",
      "step-5-active",
    );

    // ------------------------------------------------------
    // Activar estado visual correspondiente
    // ------------------------------------------------------

    document.body.classList.add(`step-${stepNumber}-active`);

    // ------------------------------------------------------
    // Activar funcionalidad correspondiente
    // ------------------------------------------------------

    switch (stepNumber) {
      case 1:
        activateStep1();

        break;

      case 2:
        activateStep2();

        break;

      case 3:
        activateStep3();

        break;

      case 4:
        activateStep4();

        break;

      case 5:
        activateStep5();

        break;
    }
  };

  // ========================================================
  // 6. DIBUJAR PELOTA
  // ========================================================

  const drawBall = () => {
    // Limpiar Canvas

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barra superior

    ctx.fillStyle = "#dbeafe";

    ctx.fillRect(0, 0, canvas.width, 45);

    // Texto

    ctx.fillStyle = "#1e3a8a";

    ctx.font = "bold 18px Arial";

    ctx.fillText("Haz clic sobre la pelota", 20, 29);

    // Pelota

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fillStyle = ball.color;

    ctx.fill();

    // Borde

    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.strokeStyle = "#1e3a8a";

    ctx.lineWidth = 3;

    ctx.stroke();
  };

  // ========================================================
  // 7. VALIDAR NOMBRE
  // ========================================================

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

  // ========================================================
  // 8. VELOCIDAD
  // ========================================================

  const updateSpeed = () => {
    const speed = Number(speedInput.value);

    speedValue.textContent = speed;

    const directionX = ball.velocityX >= 0 ? 1 : -1;

    const directionY = ball.velocityY >= 0 ? 1 : -1;

    ball.velocityX = speed * directionX;

    ball.velocityY = speed * 0.7 * directionY;
  };

  // ========================================================
  // 9. TAMAÑO
  // ========================================================

  const updateSize = () => {
    const size = Number(sizeInput.value);

    sizeValue.textContent = size;

    ball.radius = size;
  };

  // ========================================================
  // 10. TEMA
  // ========================================================

  const toggleTheme = () => {
    document.body.classList.toggle("dark-theme");
  };

  // ========================================================
  // 11. POSICIÓN ALEATORIA
  // ========================================================

  const moveBallToRandomPosition = () => {
    const margin = ball.radius;

    ball.x = margin + Math.random() * (canvas.width - margin * 2);

    ball.y = 45 + margin + Math.random() * (canvas.height - 45 - margin * 2);
  };

  // ========================================================
  // 12. ACTUALIZAR PELOTA
  // ========================================================

  const updateBall = (dt) => {
    /*
     * Delta Time:
     *
     * posición =
     * posición + velocidad * dt
     *
     * Esto hace que el movimiento dependa del tiempo
     * transcurrido entre frames.
     */

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

  // ========================================================
  // 13. ACTUALIZAR FPS
  // ========================================================

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

  // ========================================================
  // 14. FINALIZAR JUEGO
  // ========================================================

  const endGame = () => {
    isRunning = false;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;
    }

    gameStatus.textContent = "Estado: terminado";

    gameMessage.textContent = `Juego terminado. Puntaje final: ${score}`;

    startButton.textContent = "Iniciar";
  };

  // ========================================================
  // 15. GAME LOOP
  // ========================================================

  const gameLoop = (timestamp) => {
    if (!isRunning) {
      return;
    }

    // Primer frame

    if (lastTimestamp === 0) {
      lastTimestamp = timestamp;

      fpsLastTimestamp = timestamp;
    }

    /*
     * Delta Time
     */

    const dt = (timestamp - lastTimestamp) / 1000;

    lastTimestamp = timestamp;

    // Tiempo

    elapsedGameTime += dt;

    timeRemaining = Math.max(0, 30 - Math.floor(elapsedGameTime));

    timeElement.textContent = timeRemaining;

    // Finalizar

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
     * requestAnimationFrame
     */

    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // ========================================================
  // 16. INICIAR JUEGO
  // ========================================================

  const startGame = () => {
    if (isRunning) {
      return;
    }

    if (!validatePlayerName()) {
      return;
    }

    // Si terminó la partida,
    // comenzar una nueva

    if (timeRemaining <= 0) {
      score = 0;

      timeRemaining = 30;

      elapsedGameTime = 0;

      frameCount = 0;

      fps = 0;

      fpsFrameCount = 0;

      combo = 0;

      scoreElement.textContent = "0";

      timeElement.textContent = "30";

      fpsElement.textContent = "0";

      frameCounter.textContent = "0";

      comboElement.textContent = "0";

      ball.color = "#2563eb";

      moveBallToRandomPosition();
    }

    isRunning = true;

    lastTimestamp = 0;

    fpsLastTimestamp = 0;

    gameStatus.textContent = "Estado: ejecutándose";

    gameMessage.textContent = "Haz clic sobre la pelota";

    startButton.textContent = "Pausar";

    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // ========================================================
  // 17. PAUSAR
  // ========================================================

  const pauseGame = () => {
    isRunning = false;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = null;
    }

    gameStatus.textContent = "Estado: pausado";

    gameMessage.textContent = "Juego pausado.";

    startButton.textContent = "Continuar";
  };

  // ========================================================
  // 18. REINICIAR
  // ========================================================

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

    combo = 0;

    scoreElement.textContent = "0";

    timeElement.textContent = "30";

    fpsElement.textContent = "0";

    frameCounter.textContent = "0";

    comboElement.textContent = "0";

    gameStatus.textContent = "Estado: detenido";

    gameMessage.textContent = 'Ingresa tu nombre y presiona "Iniciar".';

    startButton.textContent = "Iniciar";

    ball.x = canvas.width / 2;

    ball.y = canvas.height / 2;

    ball.color = "#2563eb";

    updateSpeed();

    updateSize();

    drawBall();
  };

  // ========================================================
  // 19. CLICK SOBRE CANVAS
  // ========================================================

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

    // Acierto

    if (distance <= ball.radius) {
      score++;

      scoreElement.textContent = score;

      combo++;

      comboElement.textContent = combo;

      const colors = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a"];

      ball.color = colors[score % colors.length];

      moveBallToRandomPosition();

      gameMessage.textContent = `Acierto. +1 punto · Combo x${combo}`;

      drawBall();
    }
  };

  // ========================================================
  // 20. EVENTOS DE LOS PASOS
  // ========================================================

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.step);

      activateStep(step);
    });
  });

  // ========================================================
  // 21. EVENTOS DEL JUEGO
  // ========================================================

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

  // ========================================================
  // 22. INICIALIZACIÓN
  // ========================================================

  updateSpeed();

  updateSize();

  resetGame();

  /*
   * El Paso 1 queda seleccionado inicialmente.
   */

  activateStep(1);
})();
