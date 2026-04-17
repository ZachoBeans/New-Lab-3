// All of the methods on the page are now working in sync with the class "Ui".

const NUMBER_OF_DOMINOS = 20;

// -------------------- UI --------------------
class Ui {

    constructor () { // My constructor for the class
    this.dominoElements = [];
    this.targetElement = null;
    this.statusElement = null;
    }

    cacheDominoElements() {
        this.dominoElements = [];
        for (let i = 0; i < NUMBER_OF_DOMINOS; i++) {
            this.dominoElements.push(document.getElementById(i));
        }

        this.targetElement = document.getElementById('target-domino');
        this.statusElement = document.getElementById('status');
    }

    formatDominoText(domino) {
        return domino.leftPips + ' | ' + domino.rightPips;
    }

    showAllBacks() {
        // TODO: iterate over dominoElements and show the back for each domino.

        for (let i = 0; i < NUMBER_OF_DOMINOS; i++) {
            this.showDominoBack(i);
        }
    }

    showDominoBack(index) {
        // TODO: show the back of the domino at the given index.

        let domino = this.dominoElements[index];
        domino.classList.add("back");
    }

    showGridDominoFace(index, dominoObj) {
        // TODO: show the face of the domino at the given index.

        let domino = this.dominoElements[index];
        this.dominoElements[index].innerHTML = this.formatDominoText(dominoObj);
        domino.classList.remove("back");
    }

    updateTarget(dominoObj) {
        this.targetElement.textContent = this.formatDominoText(dominoObj);
    }

    disableDomino(index) {
        // TODO: disable the domino at the given index.

        let domino = this.dominoElements[index];
        domino.onclick = null;
        domino.style.cursor = 'default';
    }

    disableAllDominos() {
        // TODO: iterate over dominoElements and disable each domino.

        for (let i = 0; i < NUMBER_OF_DOMINOS; i++) {
           this.disableDomino(i);
        }
    }

    enableAllDominos(clickHandler, onlyRemaining = false) {
        for (const domino of this.dominoElements) {
            const isRemoved = domino.classList.contains('removed');
            if (!onlyRemaining || !isRemoved) {
                domino.onclick = clickHandler;
                domino.style.cursor = 'pointer';
            }
        }
    }

    removeDomino(index) {
        // TODO: remove the domino at the given index from the board.

        let domino = this.dominoElements[index];
        this.disableDomino(index);
        domino.classList.add("removed");
    }

    updateStatus(lives, removedCount, message = '') {
        // TODO: show lives, removed count, and optional message in the status element.

        this.statusElement.innerHTML = `Lives: ${lives} Removed: ${removedCount}/${NUMBER_OF_DOMINOS} ${message}`;
    }
};

export { Ui }; // My export of this class as a module