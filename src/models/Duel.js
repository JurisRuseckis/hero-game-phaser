import {Combatant} from "./Combatant";
import {groupArrByKey} from "../helpers/groupArrByKey";

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
     * @param {Combatant[]} props.combatants
     * @param {DuelScene} props.scene - currently passing whole scene
     */
    constructor(props)
    {
        this.combatants = props.combatants;
        this.corpses = [];
        this.status = duelStatus.started;
        this.scene = props.scene;
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
    handleTurn(action)
    {
        // if no action is passed then return
        if(!action) return false;

        // todo: pass in target from somewhere else and handle multiple targets
        const moveMaker = this.combatants[0];
        const target = this.combatants[1];

        action.applyActionEffects(moveMaker, target);

        // update list after action
        this.updateCombatantList();
        const teams = groupArrByKey(this.combatants, 'team');
        // check how many teams are left
        if(teams.length < 2){
            this.status = duelStatus.finished;
            console.log('duel ended');
            console.log(`${this.combatants.map((c) => c.label).join(',')} has won!`);
            console.log(`${this.corpses.map((c) => c.label).join(', ')} has died!`);
        }
        // if one team is left then calculate victory

        this.nextTurn();

        // somehow update battle scene when turn is handled
        // sleep(1000).then(()=>{
        //     this.update({action:props.action});
        // });
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
     * advance to next turn
     */
    nextTurn()
    {
        // check if duel can advance to next turn
        if(this.status === duelStatus.finished) return;

        // getting current turn
        this.advanceTurnMeters();

        if(this.combatants[0].isPlayable){
            // if playable then prepare action btns and wait for input
            this.scene.updateActionBtns(this.combatants[0].duelActions);
            return;
        }

        // else ai moves
        this.handleTurn(this.combatants[0].calculateAIAction(this));
    }

    /**
     * duels first phase
     */
    init()
    {
        this.nextTurn();
    }
}