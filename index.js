/**
 * 🎲 Dicee Core Engine ✡
 * Author: Khani
 * Features: State management, synthesized audio FX, smooth UI animations, keyboard triggers.
 */

// ==========================================================================
// 1. DevTools Console Signature
// ==========================================================================
console.log(
  "%c Dicee Engine Activated %c ✡ Khani ",
  "background: #39494b; color: #4e9acc; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
  "background: #4e65cc; color: #ffffff; padding: 4px 8px; border-radius: 4px;"
);

// ==========================================================================
// 2. Game State & Synthesized Web Audio FX
// ==========================================================================
const GameState = {
  isRolling: false,
  scores: { player1: 0, player2: 0 },
  wins: { player1: 0, player2: 0 },
};

// Play synthesized dice shake sound using native Web Audio API (no external MP3s needed)
const playRollSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    // Fail silently if browser blocks autoplay audio context
  }
};

// ==========================================================================
// 3. Engine Helpers & Mechanics ✡
// ==========================================================================
const getRandomDice = () => Math.floor(Math.random() * 6) + 1;

const updateDiceVisual = (element, value) => {
  element.setAttribute("src", `images/dice${value}.png`);
  element.setAttribute("alt", `Dice showing ${value}`);
};

// Animate dice rolling effect before revealing outcome
const animateRoll = (diceElements, callback) => {
  let counter = 0;
  playRollSound();

  const interval = setInterval(() => {
    counter++;
    const tempRoll1 = getRandomDice();
    const tempRoll2 = getRandomDice();

    updateDiceVisual(diceElements[0], tempRoll1);
    updateDiceVisual(diceElements[1], tempRoll2);

    // Subtle shake animation
    diceElements[0].style.transform = `rotate(${Math.sin(counter) * 10}deg)`;
    diceElements[1].style.transform = `rotate(${Math.cos(counter) * 10}deg)`;

    if (counter >= 10) {
      clearInterval(interval);
      diceElements[0].style.transform = "rotate(0deg)";
      diceElements[1].style.transform = "rotate(0deg)";
      callback();
    }
  }, 50);
};

// ==========================================================================
// 4. Main Game Loop Execution
// ==========================================================================
const executeTurn = () => {
  if (GameState.isRolling) return;
  GameState.isRolling = true;

  const titleElement = document.querySelector(".title");
  const diceElements = document.querySelectorAll(".dice img");

  titleElement.textContent = "Rolling...";

  animateRoll(diceElements, () => {
    GameState.scores.player1 = getRandomDice();
    GameState.scores.player2 = getRandomDice();

    const { player1, player2 } = GameState.scores;

    // Apply final roll images
    updateDiceVisual(diceElements[0], player1);
    updateDiceVisual(diceElements[1], player2);

    // Evaluate result & update state
    if (player1 > player2) {
      GameState.wins.player1++;
      titleElement.textContent = "🚩 Player 1 Wins!";
    } else if (player2 > player1) {
      GameState.wins.player2++;
      titleElement.textContent = "Player 2 Wins! 🚩";
    } else {
      titleElement.textContent = "Draw!";
    }

    GameState.isRolling = false;
  });
};

// ==========================================================================
// 5. Event Listeners & Trigger Controllers ✡
// ==========================================================================
// Click anywhere on page or press SPACEBAR to roll
document.addEventListener("DOMContentLoaded", () => {
  executeTurn(); // Initial roll on load

  // Re-roll on spacebar press
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      executeTurn();
    }
  });

  // Re-roll on title or dice container click
  const interactiveArea = document.querySelector(".container");
  if (interactiveArea) {
    interactiveArea.style.cursor = "pointer";
    interactiveArea.addEventListener("click", executeTurn);
  }
});
