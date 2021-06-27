import {randomInt} from "../helpers/randomInt";

export default class BattleAI
{
    /**
     *
     * @param {Object} props
     * @param {string} props.key
     * @param {function} props.battleAI
     */
    constructor(props) {
        this.key = props.key;
        this.battleAI = props.battleAI;
    }


    /**
     *
     * @param {Battle} battle - for analytics
     * @param {Combatant} executor
     * @return {CombatAction}
     */
    calculateBattleAIAction(battle,executor){
        return this.battleAI(battle, executor);
    }
}