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
     * @return {string}
     * todo: add multiple target options
     */
    applyActionEffects(combatant, target) {
        return this.operation(combatant, target);
    }
}