/**
 * ✡ Dicee Game Controller
 * Generates random numbers, updates dice images, and displays the winner.
 */

// Helper function to generate a random dice roll (1 - 6)
const rollDice = () => Math.floor(Math.random() * 6) + 1;

// Helper function to update a dice image source
const updateDiceImage = (element, diceNumber) => {
  element.setAttribute("src", `images/dice${diceNumber}.png`);
  element.setAttribute("alt", `Dice showing ${diceNumber}`);
};

// Main Game Execution Function ✡
const playGame = () => {
  // DOM Elements
  const titleElement = document.querySelector(".title");
  const diceElements = document.querySelectorAll(".dice img");

  // Generate rolls for both players
  const player1Roll = rollDice();
  const player2Roll = rollDice();

  // Update UI with corresponding dice images
  updateDiceImage(diceElements[0], player1Roll);
  updateDiceImage(diceElements[1], player2Roll);

  // Determine winner and update title heading
  if (player1Roll > player2Roll) {
    titleElement.textContent = "🚩 Player 1 Wins!";
  } else if (player2Roll > player1Roll) {
    titleElement.textContent = "Player 2 Wins! 🚩";
  } else {
    titleElement.textContent = "Draw!";
  }
};

// Execute game logic when script loads
playGame();

console.log(
  "%c Crafted by Khani %c ✡ ",
  "background: #39494b; color: #4e9acc; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
  "font-size: 14px;"
);
