// Domino Game from Lab 1 being used for Lab 2, and now for Lab 3.

// Hello, Zach Snyder here. I updated this for Lab 3 on 4/15/26. I have updated all of my comments.
// This was originally written by Brian Bird and I have updated it multiple times.

import { GameLogic } from "./gameLogic.js";
import { Ui } from "./ui.js"; // Changed my import to a capital "U" in "Ui" because it is now a class.

// -------------------- Main Flow --------------------


const ui = new Ui(); // Made this to accomadate for all the instances of using "ui".
const gameLogic = new GameLogic();

const init= () => {
    ui.cacheDominoElements();
    gameLogic.fillDominos();
    gameLogic.shuffleGridDominos();
    ui.showAllBacks();
    ui.updateTarget(gameLogic.dominos[gameLogic.currentTargetIndex]);
    ui.updateStatus(gameLogic.lives, gameLogic.removedCount);
    ui.enableAllDominos(handleClick);
}

function handleClick() {
    const CHECK_DELAY_MS = 1500;
    const index = Number(this.id);

    gameLogic.pickDomino(index);
    ui.showGridDominoFace(index, gameLogic.dominos[index]);
    ui.disableDomino(index);
    ui.disableAllDominos();

    setTimeout(resolvePick, CHECK_DELAY_MS);
}

    const resolvePick = () => {
    const pickIndex = gameLogic.currentPick;

    if (pickIndex === -1) {
        return;
    }

    if (gameLogic.isHigherThanTarget()) {
        const didReduceTarget = gameLogic.acceptPick();
        ui.removeDomino(pickIndex);
        ui.updateTarget(gameLogic.dominos[gameLogic.currentTargetIndex]);
        if (didReduceTarget) {
            ui.updateStatus(gameLogic.lives, gameLogic.removedCount, 'Great! Target reduced by 1.');
        }
        else {
            ui.updateStatus(gameLogic.lives, gameLogic.removedCount, 'Great! Domino removed.');
        }
    }
    else {
        const lostLife = gameLogic.rejectPick();
        ui.showDominoBack(pickIndex);

        if (lostLife) {
            ui.updateStatus(gameLogic.lives, gameLogic.removedCount, 'Too low again. Life lost.');
        }
        else {
            ui.updateStatus(gameLogic.lives, gameLogic.removedCount, 'Too low. First warning, no life lost.');
        }
    }

    const hasWon = gameLogic.hasClearedBoard();
    const hasLost = gameLogic.isOutOfLives();

    if (hasWon) {
        ui.updateStatus(gameLogic.lives, gameLogic.removedCount, 'You win! Board cleared.');
        ui.disableAllDominos();
    }
    else if (hasLost) {
        ui.updateStatus(gameLogic.lives, gameLogic.removedCount, 'Game over. No lives left.');
        ui.disableAllDominos();
    }
    else {
        ui.enableAllDominos(handleClick, true);
    }

    gameLogic.resetPick();
}

window.onload = init;
