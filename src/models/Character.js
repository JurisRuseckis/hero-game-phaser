export const race = {
    Human: 'human',
    Orc: 'orc',
    Dwarf: 'dwarf',
    Elf: 'elf',
    Goblin: 'goblin',
};

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
     * @param {string} props.race
     * @param {boolean} props.isPlayable
     * @param {Object} props.combatActions
     * @param {BattleAI} props.battleAI
     */
    constructor(props) {
        this.baseHP = props.baseHP;
        this.baseSpeed = props.baseSpeed;
        this.name = props.name;
        this.img = props.img;
        this.atk = props.atk;
        this.race = props.race;
        this.battleAI = props.battleAI;
        /**
         * @type {Object}
         */
         this.combatActions = props.combatActions;
        /**
         * @type {boolean}
         */
        this.isPlayable = props.isPlayable;
    }
}