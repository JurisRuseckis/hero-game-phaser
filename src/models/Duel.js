import {Combatant} from "./Combatant";

/**
 * Duel
 * @property.arena
 * @property.player
 * @property.enemy
 *
 * @mechanics.speed
 * TODO: create class for turnMeters so we can reuse it later with more combatants
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

    getFastestTurnTime()
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
        const fastestTurnTime = this.getFastestTurnTime();
        // fastest will be at top
        this.combatants = this.combatants.map((combatant)=>{
            combatant.turnMeter += fastestTurnTime * combatant.currentSpd;
            return combatant;
        }).sort((a,b) => (
            a.turnMeter < b.turnMeter)
            ? 1
            : (a.turnMeter > b.turnMeter)
                ? -1
                : 0
        );
        console.table(this.combatants);
    }

    handleTurns()
    {
        this.advanceTurnMeters();

        this.combatants[0].turnMeter = 0;
        this.combatants[1].hp -= this.combatants[0].dmg;
        console.log(`${this.combatants[0].label} Attacks ${this.combatants[1].label} for ${this.combatants[0].dmg} damage!`)

        // this.combatants.map((combatant) => {
        //     combatant.turnMeter = 0;
        //     this.combatants[1].hp -= combatant.dmg;
        //     console.log(`${combatant.label} Attacks ${this.combatants[1].label} for ${combatant.dmg} damage!`)
        //     // if turn does not affect turnmeters then
        //
        // })

        this.updateCombatantList();
    }

    updateCombatantList()
    {
        this.combatants = this.combatants.filter((c) => {
            const alive = c.hp > 0;
            if(!alive){
                console.log(`${c.label} died!`);
                this.corpses.push(c);
            }
            return alive;
        }); // others died

        if(this.combatants.length < 2){
            this.status = duelStatus.finished;
            console.log('duel ended');
            console.log(`${this.combatants.map((c) => c.label).join(',')} has won!`);
            console.log(`${this.corpses.map((c) => c.label).join(', ')} has died!`);
        }
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
        }

    }
}

class DuelControls
{
    constructor(props)
    {

    }
}