import {Combatant} from "./Combatant";
import {groupArrByKey} from "../helpers/groupArrByKey";
import BattleLog, {battleLogType} from "./BattleLog";
import Arena from "./Arena";

/**
 * battle
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

export const battleStatus = {
    undefined: -1,
    started: 0,
    finished: 1,
    paused: 2,
    deploy: 3
}

export default class Battle {

    /**
     *
     * @param {Object} props
     * @param {Combatant[]} props.combatants
     * @param {Arena} props.arena
     * @param {Phaser.Math.Vector2[]} props.deploymentTiles
     * @param {boolean} props.debugMode
     * @param {Object} props.scenario
     */
    constructor(props) {
        this.combatants = props.combatants;
        this.corpses = [];
        this.status = battleStatus.deploy;
        this.battleLog = new BattleLog();
        this.turnCount = 0;
        this.arena = props.arena;
        this.debugMode = true;
        this.deploymentTiles = props.deploymentTiles || [];
        this.scenario = props.scenario;
        // todo: pass them in teams and let battle throw in one combatant element
        this.teamStats = this.getTeamStats(this.combatants);
    }

    removeRefs(){
        this.combatants = this.combatants.map((c) => {
            const combatant = new Combatant({...c});
            combatant.removeRefs();
            return combatant;
        });
        this.arena = new Arena({...this.arena})
    }

    getTeamStats(combatants){
        const teams = combatants.reduce((r, c)=>{
            r[c.team] = r[c.team] || [];
            r[c.team].push(c);
            return r;
        }, [])
        return teams.map((team) => {
            return {
                'race' : team[0].character.race,
                'totalHP' : team.map((combatant) => combatant.hp).reduce((sum, hp)=> sum + hp, 0),
                'count' : team.length
            }
        })
    }

    getFastestTurnTime() {
        /**
         * @type {number[]}
         */
        const turnTimes = this.combatants.map((combatant) => {
            const totalSpd = this.calculateTotalSpd(combatant);
            combatant.currentSpd = totalSpd;
            return (1 - combatant.turnMeter) / totalSpd;
        });

        return Math.min(...turnTimes);
    }

    advanceTurnMeters() {
        const fastestTurnTime = this.getFastestTurnTime();

        if (fastestTurnTime === 0) {
            // Someone already has full turnmeter from previous turn, skipping calculating rest.
            // also we do not need to resort them as killed should be removed and otherwise it should be sorted
            // console.table('Someone already has full turnmeter from previous turn, skipping calculating rest.');
            this.combatants.push(this.combatants.shift());
            return;
        }
        // fastest will be at top
        this.combatants = this.combatants.map((combatant) => {
            combatant.turnMeter += fastestTurnTime * combatant.currentSpd;
            return combatant;
        }).sort((a, b) => (
            a.turnMeter < b.turnMeter)
            ? 1
            : (a.turnMeter > b.turnMeter)
                ? -1
                : 0
        );
    }

    /**
     * @param {CombatAction} action
     */
    handleTurn(action) {
        // if no action is passed then return
        if (!action) return false;

        // todo: pass in target from somewhere else and handle multiple targets
        const executor = this.combatants[0];

        this.battleLog.addTurn(action.applyActionEffects(executor, this.arena), executor, action);

        //update battle scene before carying off corpses
        // todo moved info to return value so scene can choose which params to use
        // this.scene.updateBattleScene(this, executor, action);

        // update list after action
        this.updateCombatantList();
        const teams = groupArrByKey(this.combatants, 'team');
        // check how many teams are left
        if (Object.keys(teams).length < 2) {
            this.status = battleStatus.finished;
            // move to scene 
            // this.scene.showResults({});
            this.battleLog.addText(`Battle ended. Team ${this.combatants[0].team} has won`)
            if (this.debugMode) {
                // console.log('survivors');
                // console.table(this.combatants);
                // console.log('corpses');
                // console.table(this.corpses);
                // const winner = this.combatants[0].team;
                // const leftoverHP = this.combatants.map((c)=> c.hp).reduce((sum, hp)=> sum + hp, 0);
                // const totalHP = this.teamStats[this.combatants[0].team].totalHP;
                // const percentage = ( leftoverHP / totalHP ) * 100
                // console.log(`team ${winner}, ${leftoverHP}/${totalHP} HP (${percentage}%)`)
            }
            // move to scene
            // this.scene.updateActionBtns([]);
            return;
        }

        this.turnCount++;
    }

    updateCombatantList() {
        this.combatants = this.combatants.filter((c) => {
            const alive = c.hp > 0;
            if (!alive) {
                const msg = `${c.label} from team ${c.team} died!`;
                this.battleLog.addText(msg);
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
    calculateTotalSpd(combatant) {
        return combatant.character.baseSpeed;
    }

    /**
     * advance to next turn
     */
    nextTurn() {
        // console.table(this.combatants);
        // check if battle can advance to next turn
        if (this.status === battleStatus.finished) return;

        // getting current turn
        this.advanceTurnMeters();

        if (this.combatants[0].isPlayable) {
            // if users is playable 

            // if action is passed then do it,
            // else nothing
            // this.scene.updateActionBtns(this.combatants[0].combatActions);
        } else {
            // else ai moves
            this.handleTurn(this.combatants[0].calculateBattleAIAction(this));
            // console.table(this.combatants);
        }

        return this.battleLog.getLastOfType(battleLogType.turn);
    }

    /**
     *
     * @param {boolean} inTeams
     * @returns {Array}
     */
    getCombatants(inTeams = false) {
        if (inTeams) {
            return groupArrByKey(this.combatants, 'team');
        }

        return this.combatants;
    }

    togglePause() {
        if (this.status !== battleStatus.finished) {
            this.status = this.status === battleStatus.started
                ? battleStatus.paused
                : battleStatus.started
        }
    }

    finishDeployment(){
        this.status = battleStatus.started;
    }

    getWinnerTeam() {
        if (this.status !== battleStatus.finished){
            return null;
        }

        return this.combatants[0].team;
    }

    getBattleSummary(){
        if (this.status !== battleStatus.finished){
            return null;
        }

        // todo: add stat counters for each combatant
        return {
            'rawData' : {
                'teamStats': this.teamStats,
                'winners' : this.combatants[0].team,
                'turnCount' : this.turnCount,
                'winnerStats' : {
                    'leftoverHP' : this.combatants.map((c)=> c.hp).reduce((sum, hp)=> sum + hp, 0)
                }
            },
            'texts': {
                'belligerents': this.teamStats.filter((s) => !!s).map((s, i) => `team ${i+1} (${s.race})`).join(" v "),
                'winners' : `team ${this.combatants[0].team} (${this.teamStats[this.combatants[0].team].race})`,
            }
        }
    }
}