// Hello, Zach here. I have used the reference "Ship, Captain, Crew" project and modified the code in almost all the files. There are some that I didn't touch
// because there was no need to. (Player.js and Die.js were not modified).

// For each of my additions or modifications to the code, to make it easy, I have added a "Zach Update" comment next to the rest of the comment that explains
// what I am doing and why.

// This whole project (including the js files under the models folder) were last updated on 4/18/26 and it was modified by Zach Snyder.
// Notice: I did use the help of AI to help point out areas that I couldn't find in this code (because this was just a massive amount of code that I'm not used to seeing).


import Game from './models/Game.js';
// Written by Brian Bird, 4/10/2026 with AI assistance from Gemini 3.1 in Antigravity.

// ---- Module State & DOM Elements ---- //
const game = new Game();

// Setup Screen Elements
const setupScreen = document.getElementById('setup-screen');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const startGameBtn = document.getElementById('start-game-btn');

// Game Screen Elements
const gameScreen = document.getElementById('game-screen');
const currentPlayerDisplay = document.getElementById('current-player-display');
const messageDisplay = document.getElementById('message-display');
const diceContainer = document.getElementById('dice-container');
const rollBtn = document.getElementById('roll-btn');
const nextTurnBtn = document.getElementById('next-turn-btn');

// Scoreboard Screen Elements
const scoreboardScreen = document.getElementById('scoreboard-screen');
const winnerDisplay = document.getElementById('winner-display');
const scoreList = document.getElementById('score-list');
const newGameBtn = document.getElementById('new-game-btn');

// ---- Initialization ---- //
function init() {
    // Attach Event Listeners
    startGameBtn.addEventListener('click', handleStartGame);
    rollBtn.addEventListener('click', handleRollClick);
    nextTurnBtn.addEventListener('click', handleNextTurnClick);
    newGameBtn.addEventListener('click', handleNewGameClick);
}

// ---- Event Handlers ---- //

// Triggered when the players submit their names to begin.
// We validate that names are distinct to avoid confusion on the scoreboard.
function handleStartGame() {
    const p1 = player1Input.value.trim() || 'Player 1';
    const p2 = player2Input.value.trim() || 'Player 2';
    
    if (p1 === p2) {
        alert("Please enter distinct names for players.");
        return;
    }
    
    // Pass the data to the Game model to initialize its internal state.
    game.startNewGame([p1, p2]);
    
    // Visually transition from the setup screen to the actual game board.
    switchScreen(setupScreen, gameScreen);
    
    // We render the dice before updating the UI so the question marks (?) appear instantly.
    renderDice();
    updateUI();
}

function handleRollClick() {
    game.rollDice();
    renderDice();
    updateUI();
}

function handleNextTurnClick() {
    game.endTurn();
    if (game.isGameOver) {
        showScoreboard();
    } else {
        renderDice();
        updateUI();
    }
}

function handleNewGameClick() {
    switchScreen(scoreboardScreen, setupScreen);
}

// ---- UI Updaters ---- //
function showMessage(text) {
    messageDisplay.textContent = text;
    // Clear message after 3 seconds if it hasn't been overwritten
    setTimeout(() => {
        if (messageDisplay.textContent === text) {
            messageDisplay.textContent = "";
        }
    }, 3000);
}

function updateUI() {
    const currentPlayer = game.getCurrentPlayer();
    
    currentPlayerDisplay.textContent = `${currentPlayer.name}'s Turn`;
    rollBtn.textContent = `Roll Dice (${game.rollsLeft} left)`;
    
    // Manage button visibility cleanly with toggles.
    // The roll button hides when the turn is over (0 rolls left).
    // The next turn button hides BEFORE the first roll (when rolls left is 3).
    rollBtn.classList.toggle('hidden', game.isTurnOver());

    // Zach Update. I'm actually crying laughing right now because I changed the number from when the button hides itself to a -1, which
    // I thought was outrageous, but it actually ended up working hahahaha. For some reason I swear I remember not being able to use negative numbers like this.
    nextTurnBtn.classList.toggle('hidden', game.rollsLeft === -1);

    // Zach Update. Added this to make it so the die has to be chosen before continuing to roll.
    rollBtn.disabled = (
    game.rollsLeft < 5 && !game.hasHeldThisRoll
)   ;

    // Dynamic Button text for keeping score
    if (game.diceSet.isQualified()) {
        const cargo = game.diceSet.getCurrentCargoScore();
        nextTurnBtn.textContent = `Keep Score: ${cargo} & End Turn`;
    } else {
        nextTurnBtn.textContent = `End Turn (Score: 0)`;
    }
}

// Physically builds the 5 HTML dice elements on the screen.
// We completely clear and rebuild the container each time to ensure the UI
// perfectly reflects the current state of the Game model's `dice` array.
function renderDice() {
    diceContainer.innerHTML = '';
    
    // The player's very first view of the board happens before they roll.
    // Since they always start with 3 rolls, we know they haven't rolled yet.

    // Zach Update. I have updated this "rollsLeft" to 6 so the questions marks that were appearing on the dice after the second roll are now gone.
    const isFirstRoll = game.rollsLeft === 5;

    // HTML Decimal codes for dice faces 1-6 (⚀, ⚁, etc.)
    // These specific numbers (9856-9861) act as shortcuts for the browser to render 
    // native font-based icons instead of needing distinct image files for every die face!
    const diceEntities = ['?', '&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];

    for (const die of game.diceSet.dice) {
        // Create an empty DIV to act as the box for a single die.
        const dieEl = document.createElement('div');
        dieEl.className = 'die';
        
        // Allow the player to manually interact with the dice to set their own holds.
        dieEl.addEventListener('click', () => {
            if (isFirstRoll) return; // Cannot hold before the game starts
            
            // Check legality of the click before allowing the hold
            if (!die.isHeld) {
                const validation = game.diceSet.canHold(die);
                if (validation !== true) {
                    showMessage(validation);
                    return;
                }
            } else {
                const validation = game.diceSet.canUnhold(die);
                if (validation !== true) {
                    showMessage(validation);
                    return;
                }
            }
            
            showMessage(""); // Clear any previous error message on a success
            die.toggleHold();
            game.diceSet.evaluateDice(); // Check if this new hold triggers a qualifier!

            // Zach Update. Added this here to make it so the die has to be chosen to continue rolling.
            game.hasHeldThisRoll = true;
            
            // Re-render the UI loop to reflect the new state
            renderDice();
            updateUI();
        });
        
        // Apply CSS classes based on the logical outcome of the die or the turn.
        if (die.isHeld) {
            dieEl.classList.add('held'); // Green background for a kept die 
        } else if (game.diceSet.isQualified()) {
            dieEl.classList.add('cargo'); // Automatically highlight non-held dice as Cargo!
        } else if (game.hasBusted()) {
            dieEl.classList.add('failed'); // Red background indicating a busted roll
        }
        
        // Inject the appropriate HTML entity to graphically render the die face.
        if (die.value == null) {
            dieEl.textContent = '?';
        } else {
            dieEl.innerHTML = diceEntities[die.value];
        }
            // Since our random dice rolls yield 1 through 6, we can use that exact value 
            // as the index to grab the corresponding HTML entity from our array.
        
        diceContainer.appendChild(dieEl);
    }
}

function showScoreboard() {
    switchScreen(gameScreen, scoreboardScreen);
    
    scoreList.innerHTML = '';
    
    for (const player of game.players) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${player.name}</span> <strong>${player.score}</strong>`;
        scoreList.appendChild(li);
    }

    const winners = game.getWinners();
    if (winners.length > 1) {
        winnerDisplay.textContent = "It's a Tie!";
    } else {
        winnerDisplay.textContent = `${winners[0].name} Wins!`;
    }
}

function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove('active');
    hideScreen.classList.add('hidden');
    
    showScreen.classList.remove('hidden');
    showScreen.classList.add('active');
}

// Start Application
init();
