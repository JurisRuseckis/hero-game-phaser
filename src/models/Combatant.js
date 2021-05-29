import {randomInt} from "../helpers/randomInt";

export class Combatant {
    /**
     *
     * @param {Object} props
     * @param {Character} props.character
     * @param {number} props.team
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
         * @type {boolean}
         */
        this.isPlayable = props.character.isPlayable;
        /**
         * @type {number}
         */
        this.team = props.team;
        /**
         * @type {DuelAction[]}
         */
        this.duelActions = props.character.duelActions;
    }

    calculateHP() {
        return this.character.baseHP;
    }

    calculateDmg() {
        return this.character.atk + randomInt(4);
    }

    /**
     *
     * @param {Duel} duel - for analytics
     * @return {DuelAction}
     */
    calculateAIAction(duel) {
        // for testing purposes currently always attack
        return this.duelActions[1];
    }

}