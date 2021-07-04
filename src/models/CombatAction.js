export default class CombatAction
{
    /**
     *
     * @param {Object} props
     * @param {string} props.key
     * @param {number} props.cooldown
     * @param {function} props.operation
     * @param {function} props.targetRules
     */
    constructor(props) {
        this.key = props.key;

        this.operation = props.operation;
        this.targetRules = props.targetRules;

        this.cooldown = props.cooldown;
        this.cooldownLeft = 0;

        /**
         * filled after action is picked
         * @var {Combatant}
         */
        this.target = null;
    }

    /**
     *
     * @param {Combatant} combatant
     * @param {Arena} arena
     * @return {string}
     * todo: add multiple target options
     */
    applyActionEffects(combatant,arena) {
        let actionTxt = this.operation(combatant, this.target, arena);
        this.cooldownLeft = this.cooldown;
        return actionTxt;
    }

    onCooldown(){
        return this.cooldownLeft > 0;
    }

    /**
     * validates and sets target
     * @param {Combatant} executor 
     * @param {Combatant} target 
     * @returns {boolean}
     */
    pickTarget(executor,target){
        if(!this.targetRules(executor, target)){
            return false;
        }
        
        this.target = target;
        return true;
    }

    /**
     * returns indices of combatants that qualifies as targets for this action
     * @param {Combatant} executor 
     * @param {Combatant[]} combatants
     * @param {Arena} arena
     * @returns {number[]} indices of given array
     */
    getAvailableTargets(executor, combatants, arena){
        return combatants.map((target,index) => {
            if(this.targetRules(executor, target, arena)){
                return index;
            }
            return null;
        }).filter(c => !!c);
    }
}