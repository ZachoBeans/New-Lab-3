import Die from './Die.js';

export default class DiceSet {
    constructor() {
        this.dice = [];
        // Zach Update. Updated this for loop to include 6 dice.
        for (let i = 0; i < 6; i++) {
            this.dice.push(new Die());
        }

        // Zach Update. Updated this from this.hasShip to has1 and has4 as those are the qulifiers for the game to score points.
        this.has1 = false;
        this.has4 = false;
    }

    rollAll() {
        for (const die of this.dice) {
            die.roll();
        }
        this.evaluateDice();
    }

    evaluateDice() {
        // Reset state so it can be dynamically evaluated based on what the user currently holds.
        this.has1 = false;
        this.has4 = false;

        // Simply check the pool of manually held dice for the presence of our target qualifiers.

        // Zach Update. Updated this so the dice needing to be held is a 1 and a 4 instead of the 6, 5, and 4.    
        let held1 = false;
        let held4 = false;

        // Zach Update. Updated this so isHeld works on dice with a 1 or 4.
        for (const die of this.dice) {
            if (die.isHeld) {
                if (die.value === 1) held1 = true;
                else if (die.value === 4) held4 = true;
            }
        }

        // Apply rules strictly based on what is currently held: 
        // Ship unlocks Captain, Captain unlocks Crew

        // Zach Update. Updated this so held1 and held4 were chosen.
        if (held1) {
            this.has1 = true;
            if (held4) {
                this.has4 = true;
                }
            }
        }

    // Returns true if the player has secured all three qualifiers (Ship, Captain, Crew).
    
    isQualified() {

        // Zach Update. Updated this to return has1 and has4 instead of hasShip and hasCaptain.
        return this.has1 && this.has4;
    }

    // Checks if the physical board contains the 6, 5, and 4, regardless of whether 
    // the user has actually clicked to hold them yet.

    canPotentiallyQualify() {

        // Zach Update. Updated these to reflect the 1 and 4.
        let has1 = false;
        let has4 = false;

        // Zach Update. Updated these to reflect the 1 and 4 as well.
        for (const die of this.dice) {
            if (die.value === 1) has1 = true;
            if (die.value === 4) has4 = true;
        }

        return has1 && has4;
    }

    // Validates if the player is legally allowed to hold a newly clicked die.
    
    // Zach Update. I have updated this canHold method to verify if the die is already being held.
     canHold(die) {
        if (die.value === 1 && this.has1 && !this.isQualified()) return "You already have a 1! Additional 1s count for points!";
        if (die.value === 4 && this.has4 && !this.isQualified()) return "You already have a 4! Additional 4s count for points!";
        return true;
    }

    // Validates if the player is legally allowed to un-keep a clicked die.

    // Zach Update. Updated the values and has variables. Don't know if I did it right. Taking this method out completely makes it so
    // you cannot unclick a die. Seemingly changing the variables to the ones I created doesn't make the ones clicked (like a 1 and a 4)
    // un clickable. But all in all, the player should have the choice to unclick the die anyway.
    canUnhold(die) {
        if (die.value === 1 && this.has1) {
            let held6Count = 0;
            for (const d of this.dice) {
                if (d.isHeld && d.value === 1) held6Count++;
            }
            if (held6Count === 4) return "You cannot remove your Ship while a Captain is held!";
        }
        if (die.value === 4 && this.has4) {
            let held5Count = 0;
            for (const d of this.dice) {
                if (d.isHeld && d.value === 4) held5Count++;
            }
            if (held5Count === 4) return "You cannot remove your Captain while a Crew is held!";
        }
        return true;
    }

    getCurrentCargoScore() {
        // A player only scores points if they have acquired the 6, 5, and 4.
        if (this.isQualified()) {
            // Because we always play with exactly 5 dice, and the qualifying
            // Ship/Captain/Crew dice will always sum exactly to 15 (6 + 5 + 4), 
            // the fastest way to sum the remaining 2 "Cargo" dice is to sum ALL 5 dice 
            // and subtract the 15 we know comes from the qualifiers.



            // Zach Update. I used this neat for loop that was already here and updated it to subtract the 5 that the 
            // dice make when adding the 1 and 4.
            let total = 0;
            for (const die of this.dice) {
                total += die.value;
            }
            return total - 5; 
        }
        return 0; // If they don't qualify with all three pieces, their score is 0.

        // Zach Update. For the above return, it will return 0 if at least a 1 and a 4 are not rolled and then chosen.
    }

    reset() {
        this.has1 = false;
        this.has4 = false;
        
        for (const die of this.dice) {
            die.reset();
        }
    }
}
