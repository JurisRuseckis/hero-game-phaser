export default class Character
{
    /**
     *
     * @param {Object} props
     * @param {number} props.baseHP
     * @param {number} props.baseSpeed
     * @param {string} props.name
     * @param {string} props.img
     * @param {number} props.atk
     * @param {boolean} props.isPlayable
     * @param {DuelAction[]} props.duelActions
     */
    constructor(props) {
        this.baseHP = props.baseHP;
        this.baseSpeed = props.baseSpeed;
        this.name = props.name;
        this.img = props.img;
        this.atk = props.atk;
        /**
         * @type {DuelAction[]}
         */
        this.duelActions = props.duelActions;
        /**
         * @type {boolean}
         */
        this.isPlayable = props.isPlayable;
    }
}