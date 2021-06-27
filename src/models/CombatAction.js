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
         * filled after picked 
         * @var {Combatant}
         */
        this.target = null;
    }

    /**
     *
     * @param {Combatant} combatant
     * @return {string}
     * todo: add multiple target options
     */
    applyActionEffects(combatant) {
        let actionTxt = this.operation(combatant, this.target);
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
     * @returns {number[]} indices of given array 
     */
    getAvailableTargets(executor, combatants){
        return combatants.map((combatant,index) => {
            if(this.targetRules(executor, combatant)){
                return index;
            }
            return null;
        }).filter(c => !!c);
    }
}