export class Combatant {
    /**
     *
     * @param {Object} props
     * @param {Character} props.character
     * @param {boolean} props.isPlayable
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
        /**
         *
         * @type {string}
         */
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
        /**
         * @type {boolean}
         */
        this.isPlayable = props.character.isPlayable;

    }

    calculateHP() {
        return this.character.baseHP;
    }

    calculateDmg() {
        return this.character.atk;
    }

}