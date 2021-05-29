export default class DuelAction
{
    /**
     *
     * @param {Object} props
     * @param {string} props.key
     * @param {function} props.operation
     */
    constructor(props) {
        this.key = props.key;
        this.operation = props.operation;
    }

    /**
     *
     * @param {Combatant} combatant
     * @param {Combatant} target
     * todo: add multiple target options
     */
    applyActionEffects(combatant, target) {
        this.operation(combatant, target);
    }
}