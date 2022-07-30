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
     * @param {string} props.key
     * @param {number} props.baseHP
     * @param {number} props.baseSpeed
     * @param {string} props.name
     * @param {[number,number]} props.atk [min,max]
     * @param {string} props.race
     * @param {boolean} props.isPlayable
     * @param {Object} props.combatActions
     * @param {Number} props.tier
     * @param {BattleAI} props.battleAI
     */
    constructor(props) {
        this.key = props.key || `${props.race}_${props.name}`;
        this.baseHP = props.baseHP;
        this.baseSpeed = props.baseSpeed;
        this.name = props.name;
        this.atk = props.atk;
        this.race = props.race;
        this.battleAI = props.battleAI;
        this.tier = props.tier
        /**
         * @type {Object}
         */
         this.combatActions = props.combatActions;
        /**
         * @type {boolean}
         */
        this.isPlayable = props.isPlayable;
    }

    printJSON(){
        return {
            key: this.key,
            name: this.name,
            race: this.race,
            baseHP: this.baseHP,
            baseSpeed: this.baseSpeed,
            atk: this.atk,
            isPlayable: this.isPlayable,
            combatActions: Object.values(this.combatActions).map(combatAction => combatAction.key),
            battleAI: this.battleAI.key,
            tier: this.tier,
        }
    }
}