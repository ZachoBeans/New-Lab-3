// BRIAN PLEASE READ THIS****

// I could not for the LIFE of me, figure out what was wrong with my later methods starting at "pickDomino". Once I changed the gameLogic
// to a class, I was refactoring the methods and once i got to the pickDomino one, it started giving errors. I tried looking it up
// and quite literally, was doing everything that I thought I could do, right. So I am very confused at what is wrong with the code.
// Because of that, I don't have this part 1 of lab 2 done correctly.

// CORRECTION**** I actually went ahead and tested it, and it IS working. I have NO idea why its giving me errors on the bottom half of
// this file. Sorry for all the lengthy comments.

const NUMBER_OF_DOMINOS = 20;
const STARTING_LIVES = 5;
const HALF_CLEARED_COUNT = NUMBER_OF_DOMINOS / 2;

// -------------------- Core Logic --------------------
function Domino(leftPips, rightPips) {
    this.leftPips = leftPips;
    this.rightPips = rightPips;
}

class GameLogic {

    constructor () { // My constructor for the class
    this.dominos = [];
    this.currentTargetIndex = NUMBER_OF_DOMINOS;
    this.currentPick = -1;
    this.lives = STARTING_LIVES;
    this.failedPickHistory = {};
    this.removedCount = 0;
    }

    fillDominos() {
        // TODO: fill the dominos array with random domino objects and a starting target.

        const leftPips = [1, 2, 3, 4];
        let [leftOne, leftTwo, leftThree, leftFour] = leftPips;

        const rightPips = [1, 2, 3, 4, 5];
        let [rightOne, rightTwo, rightThree, rightFour, rightFive] = rightPips; 

        for (const leftPip of leftPips) {
            for (const rightPip of rightPips) {
                this.dominos.push(new Domino(leftPip, rightPip));
            }
        }

        this.currentTargetIndex = [Math.floor(Math.random() * (this.dominos.length - 1))];
    }

    shuffleGridDominos() {
        // TODO: shuffle the grid dominos array randomly.

        for (let i = 0; i < NUMBER_OF_DOMINOS; i++) {
            let rndIndex = Math.trunc(Math.random() * NUMBER_OF_DOMINOS);
            let temp = this.dominos[i];
            this.dominos[i] = this.dominos[rndIndex];
            this.dominos[rndIndex] = temp;
        }
    }

    pickDomino(index) {
        // TODO: record the player's pick by setting currentPick.

        if (this.currentPick === -1) {
            this.currentPick = index;
        }
    }

    getTotalPips(domino) {
        return domino.leftPips + domino.rightPips;
    }

    isHigherThanTarget() {
        // TODO: return true when the picked domino total is greater than the target total.

        const targetDomino = this.dominos[this.currentTargetIndex];
        const pick = this.dominos[this.currentPick];

        if (this.getTotalPips(pick) > this.getTotalPips(targetDomino)) {
            return true;
        } else {
            return false;
        }
    }

    acceptPick() {
        this.removedCount++;

        if (this.removedCount > HALF_CLEARED_COUNT) {
            const targetTotal = this.getTotalPips(this.dominos[this.currentTargetIndex]);
            const reducedTargetTotal = Math.max(0, targetTotal - 1);
            const reducedLeft = Math.min(6, reducedTargetTotal);
            const reducedRight = reducedTargetTotal - reducedLeft;

            this.dominos[this.currentTargetIndex] = new Domino(reducedLeft, reducedRight);
            return true;
        }

        return false;
    }

    rejectPick() {
        const pickIndex = this.currentPick;
        const hasFailedBefore = this.failedPickHistory[pickIndex] === true;

        if (hasFailedBefore) {
            this.lives--;
            return true;
        }

        this.failedPickHistory[pickIndex] = true;
        return false;
    }

    hasClearedBoard() {
        return this.removedCount === NUMBER_OF_DOMINOS;
    }

    isOutOfLives() {
        return this.lives <= 0;
    }

    resetPick() {
        // TODO: reset currentPick to -1 for the next turn.

        this.currentPick = -1;
    }
};

export { GameLogic }; // My export of this object using it as a Module.