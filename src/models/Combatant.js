import { capitalize } from "../helpers/capitalize";
import {randomInt} from "../helpers/randomInt";
import { v4 as uuidv4 } from 'uuid';
import CombatAction from "./CombatAction";

export class Combatant {
    /**
     *
     * @param {Object} props
     * @param {Character} props.character
     * @param {number} props.team
     * @param {Phaser.Math.Vector2} props.coordinates
     * @param {Phaser.Math.Vector2} props.direction
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
        this.combatActions = this.createCombatActionInstances(props.character.combatActions);
        /**
         * @type {BattleAI}
         */
        this.ai = props.character.battleAI;
        /**
         * @type {Phaser.Math.Vector2}
         */
        this.coordinates = props.coordinates;
        /**
         * unitVector of direction
         * @type {Phaser.Math.Vector2}
         */
        this.direction = props.direction || Phaser.Math.Vector2.ZERO;
        /**
         * current A* path to enemy
         * @type {*[]}
         */
        this.currentPath = [];
        /**
         * current A* available tiles to move
         * @type {*[]}
         */
        this.moveTargets = [];
    }

    calculateHP() {
        return this.character.baseHP;
    }

    calculateDmg() {
        return randomInt(this.character.atk[1], this.character.atk[0]);
    }

    createCombatActionInstances(combatActions){
        let cmbActions = {};
        Object.values(combatActions).forEach((combatAction) => {
            //all these cloning shits that does not work
            // cmbActions[combatAction] = structuredClone(this.combatActions[combatAction]);
            // cmbActions[combatAction] = JSON.parse(JSON.stringify(this.combatActions[combatAction]));
            // cmbActions[combatAction] = {...this.combatActions[combatAction]};
            cmbActions[combatAction.key] = new CombatAction({...combatAction});
        });
        return cmbActions;
    }

    /**
     *
     * @param {Battle} battle - for analytics
     * @return {CombatAction}
     */
     calculateBattleAIAction(battle) {
        return this.ai.calculateBattleAIAction(battle,this);
     }

     print() {
         return {
             'id': this.id,
             'label': this.label,
             'hpLabel': `${this.hp}/${this.maxHp}`,
             'hp': this.hp,
             'turnMeter': this.turnMeter,
             'currentSpd': this.currentSpd,
             'team': this.team,
         }
     }

}