/**
 * Duel
 * @property.arena
 * @property.player
 * @property.enemy
 *
 * @mechanics.speed
 * - Each character will have speed attribute which can be alter by traits, mood and equipment.
 * - Each arena will have set of effects which can conditionally alter speed
 * - Duel instance calculates total speed of combatant
 * - Each combatant have turn meter which fills according to speed
 * - Turn meter holds value between 0 and 1 (mby add custom values so each character can have their own value and speed)
 * - speed and turnMeter can be affected by spells
 */

const duelStatus = {
    started: 0,
    finished: 1,
}

// todo: rename to battle and make optimized duel class
export default class Duel{
    /**
     *
     * @param {Object} props
     * @param {Character[]} props.combatants
     */
    constructor(props)
    {
        this.combatants = props.combatants.map((combatant) => {
            return new Combatant({character: combatant});
        });

        this.controls = new DuelControls({});
        this.corpses = [];
        this.status = duelStatus.started;
        // to be implemented
        // this.arena = props.arena;
    }

    calculateFastestTurn()
    {
        /**
         * @type {number[]}
         */
        const turnTimes = this.combatants.map((combatant) => {
            const totalSpd = this.calculateTotalSpd(combatant);
            combatant.currentSpd = totalSpd;
            return (1 - combatant.turnMeter) /  totalSpd;
        });

        return Math.min(...turnTimes);
    }

    advanceTurnMeters()
    {
        const fastestTurnTime = this.calculateFastestTurn();


        this.combatants.map((combatant)=>{

            combatant.turnMeter += fastestTurnTime * combatant.currentSpd;

        }).sort((a,b) => (
            a.turnMeter > b.turnMeter)
            ? 1
            : (a.turnMeter > b.turnMeter)
                ? -1
                : 0
        );

    }

    handleTurns()
    {
        this.advanceTurnMeters();

        this.combatants.map((combatant) => {
            combatant.turnMeter = 0;
            combatant.hp -= 5;
            console.log(`${combatant.label} reporting with ${combatant.hp}HP left!`)
        })

        this.updateCombatantList();
    }

    updateCombatantList()
    {
        this.combatants = this.combatants.filter((c) => {
            const alive = c.hp >= 0;
            if(!alive){
                console.log(`${c.label} died!`);
                this.corpses.push(c.label);
            }
            return alive;
        }); // others died
    }

    /**
     * calculation must be at instance side so we can add arena effects etc
     * combatant instances will just provide parameters
     * speed needs to be recalculated each turn
     * @return {number}
     */
    calculateTotalSpd(combatant)
    {
        return combatant.character.baseSpeed;
    }

    update()
    {
        if(this.status === duelStatus.finished) return;

        if(this.combatants.length > 1){
            this.handleTurns();
        } else {
            this.status = duelStatus.finished;
            console.log('duel ended');
            console.log(`${this.combatants.map((c) => c.label).join(',')} has won!`);
            console.log(`${this.corpses.join(', ')} has died!`);
        }

    }
}

class Combatant
{
    /**
     *
     * @param {Object} props
     * @param {Character} props.character
     */
    constructor(props) {

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
        this.label = this.character.name;
        this.hp = this.calculateHP();

    }

    calculateHP()
    {
        return this.character.baseHP;
    }
}

class DuelControls
{
    constructor(props)
    {

    }
}