export default class Character
{
    /**
     *
     * @param {Object} props
     * @param {number} props.baseHP
     * @param {number} props.baseSpeed
     * @param {string} props.name
     */
    constructor(props) {
        this.baseHP = props.baseHP;
        this.baseSpeed = props.baseSpeed;
        this.name = props.name;
    }
}