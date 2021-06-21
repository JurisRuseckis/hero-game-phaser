import {Combatant} from "./Combatant";
import {groupArrByKey} from "../helpers/groupArrByKey";
import { BattleScene } from "../scenes/BattleScene";
import CombatAction from "./CombatAction";

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
 * - Battle instance calculates total speed of combatant
 * - Each combatant have turn meter which fills according to speed
 * - Turn meter holds value between 0 and 1 (mby add custom values so each character can have their own value and speed)
 * - speed and turnMeter can be affected by spells
 */

const battleStatus = {
    started: 0,
    finished: 1,
}

export default class Battle{
    /**
     *
     * @param {Object} props
     * @param {Combatant[]} props.combatants
     * @param {BattleScene} props.scene - currently passing whole scene
     */
    constructor(props)
    {
        this.combatants = props.combatants;
        this.corpses = [];
        this.status = battleStatus.started;
        this.scene = props.scene;
        this.log = [];
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
            // console.table('Someone already has full turnmeter from previous turn, skipping calculating rest.');
            this.combatants.push(this.combatants.shift());
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
    }

    /**
     * @param {CombatAction} action
     * @param {Combatant} target
     */
    handleTurn(action)
    {
        // if no action is passed then return
        if(!action) return false;

        // todo: pass in target from somewhere else and handle multiple targets
        const executor = this.combatants[0];

        const log = action.applyActionEffects(executor);
        // console.log(log);
        this.log.push(log);

        // update list after action
        this.updateCombatantList();
        const teams = groupArrByKey(this.combatants, 'team');
        // check how many teams are left
        if(Object.keys(teams).length < 2){
            this.status = battleStatus.finished;
            this.scene.showResults({});
            console.log(this.log);
            console.log('battle ended');
            console.log(`team ${this.combatants[0].team} has won`)
            console.log(`${this.combatants.map((c) => c.label).join(',')} has survived!`);
            console.log(`${this.corpses.map((c) => `${c.label} from team ${c.team}`).join(', ')} has died!`);
            this.scene.updateActionBtns([]);
            return;
        }
        // if one team is left then calculate victory
        // else nextTurn
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
                const msg = `${c.label} from team ${c.team} died!`;
                this.log.push(msg);
                // console.log(msg);
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
        // console.table(this.combatants);
        // check if duel can advance to next turn
        if(this.status === battleStatus.finished) return;

        // getting current turn
        this.advanceTurnMeters();

        if(this.combatants[0].isPlayable){
            // if playable then prepare action btns and wait for input
            // this.scene.updateActionBtns(this.combatants[0].combatActions);
            return;
        }

        // else ai moves
        this.handleTurn(this.combatants[0].calculateBattleAIAction(this));
    }

    /**
     * duels first phase
     */
    init()
    {
        console.table(this.combatants);
        this.nextTurn();
    }
}