export class Combatant {
    /**
     *
     * @param {Object} props
     * @param {Character} props.character
     */
    constructor(props) {

        this.character = props.character;
        /**
         * range 0-1
         * @type {number}
         */
        this.turnMeter = 0;
        /**
         *
         * @type {number}
         */
        this.currentSpd = 0;
        this.label = this.character.name;
        /**
         *
         * @type {number}
         */
        this.hp = this.calculateHP();
        /**
         *
         * @type {number}
         */
        this.dmg = this.calculateDmg();

    }

    calculateHP() {
        return this.character.baseHP;
    }

    calculateDmg() {
        return this.character.atk;
    }

}