import { capitalize } from "../helpers/capitalize";
import {randomInt} from "../helpers/randomInt";
import { v4 as uuidv4 } from 'uuid';
import Battle from "./Battle";
import Character from "./Character";
import CombatAction from "./CombatAction";

export class Combatant {
    /**
     *
     * @param {Object} props
     * @param {Character} props.character
     * @param {number} props.team
     */
    constructor(props) {
        /**
         * @type {string}
         */
        this.id = uuidv4();
        /**
         * @type {Character}
         */
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
        this.label = `${capitalize(this.character.race)} ${capitalize(this.character.name)}`;
        /**
         *
         * @type {number}
         */
        this.hp = this.calculateHP();
        /**
         *
         * @type {number}
         */
        this.maxHp = this.hp;
        /**
         * @type {boolean}
         */
        this.isPlayable = props.character.isPlayable;
        /**
         * @type {number}
         */
        this.team = props.team;
        /**
         * @type {Object}
         */
        this.combatAction = props.character.combatActions;
        /**
         * @type {BattleAI}
         */
        this.ai = props.character.battleAI;
        /**
         * @type {Object}
         */
        this.coordinates = props.coordinates;
        /**
         * @type {Phaser.Math.Vector2}
         */
        this.direction = props.direction || Phaser.Math.Vector2.ZERO;
    }

    calculateHP() {
        return this.character.baseHP;
    }

    calculateDmg() {
        return this.character.atk + randomInt(4);
    }

    /**
     *
     * @param {Battle} battle - for analytics
     * @return {CombatAction}
     */
     calculateBattleAIAction(battle) {
        return this.ai.calculateBattleAIAction(battle,this);
     }

}