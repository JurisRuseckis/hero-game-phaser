import {Combatant} from "./Combatant";

/**
 * Duel
 * @property.arena
 * @property.player
 * @property.enemy
 * @mechanics.action
 * - attack, spell, etc
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

        if(fastestTurnTime === 0){
            // Someone already has full turnmeter from previous turn, skipping calculating rest.
            // also we do not need to resort them as killed should be removed and otherwise it should be sorted
            console.table('Someone already has full turnmeter from previous turn, skipping calculating rest.');
            return;
        }
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

    /**
     * @param {DuelAction} action
     */
    handleAction(action)
    {
        // if no action is passed then return
        if(!action) return false;

        // todo: pass in target from somewhere else
        const moveMaker = this.combatants[0];
        const target = this.combatants[1];

        action.applyActionEffects(moveMaker, target);
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

    /**
     *
     */
    update()
    {
        // disable
        if(this.status === duelStatus.finished) return;


        // getting current turn
        this.advanceTurnMeters();

        let action = null;
        if(this.combatants[0].isPlayable){
            // if playable then wait for input
            return;
        } else {
            // calculate AI action
            action = this.combatants[0].calculateAIAction(this);
        }


        this.handleAction(action);



        this.updateCombatantList();

        // if next turn is not playable then continue or start to simulate ai
        if(!this.combatants[0].isPlayable){
            this.update();

            // somehow update battle scene when turn is handled
            // sleep(1000).then(()=>{
            //     this.update({action:props.action});
            // });
        }
    }

    /**
     * duels first phase
     */
    init(){
        this.update();
    }
}