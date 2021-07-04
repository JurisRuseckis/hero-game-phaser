import {randomInt} from "../../helpers/randomInt";
import Battle, { battleType } from "../Battle";
import Character, {race} from "../Character";
import {Combatant} from "../Combatant";
import CombatAction from "../CombatAction";
import BattleAI from "../BattleAI";
import Arena from "../Arena";
import Phaser from "phaser";

// noinspection JSUnusedLocalSymbols
/**
 * @type {Object}
 */
const defaultActions = {
    wait: new CombatAction({
        key: 'wait',
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            return `${executor.label} from team ${executor.team} waits`;
        },
        targetRules: (executor, target, arena) => {
            return executor === target;
        }
    }),
    walk:  new CombatAction({
        key: 'walk',
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            return `${executor.label} from team ${executor.team} waits`;
        },
        targetRules: (executor, target, arena) => {
            return executor === target;
        }
    }),
    attack: new CombatAction({
        key: 'basic attack',
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            // todo: add arena effects
            // todo: add target effects
            const dmg = executor.calculateDmg();
            target.hp -= dmg;
            return `${executor.label} from team ${executor.team} attacks ${target.label} from team ${target.team} for ${dmg} damage!`;
        },
        targetRules: (executor, target, arena) => {
            return executor.team !== target.team;
        }
    })
};

 /**
 * @type {Object}
 */
const actionPool = {
     heal : new CombatAction({
         key: 'heal',
         cooldown: 20,
         operation: (executor, target) => {
             executor.turnMeter = 0;
             // todo: add arena effects
             // todo: add target effects
             const healAmount = executor.calculateDmg();
             target.hp += healAmount;
             if(target.hp > target.maxHp){
                 target.hp = target.maxHp;
             }
             return `${executor.label} from team ${executor.team} heals ${target.label} from team ${target.team} for ${healAmount} hp!`;
         },
         targetRules: (executor, target) => {
             return executor.team === target.team;
         }
     }),
 }

const battleAI = {
    // as all chars will have default actions then basic will be default for all
    basic: new BattleAI({
        key: 'basic',
        battleAI: (battle, executor) => {
            // for testing purposes currently always attack
            let action = executor.combatAction.attack;
            let availableTargets = action.getAvailableTargets(executor, battle.combatants, battle.arena);
            if(availableTargets){
                action.pickTarget(executor, battle.combatants[availableTargets[randomInt(availableTargets.length)]])
                return action;
            } else {
                return executor.combatAction.wait;
            }
        }
    }),
    leader:  new BattleAI({
        battleAI: (battle, executor) => {

            let attackAction = executor.combatAction.attack;
            let availableTargets = attackAction.getAvailableTargets(executor, battle.combatants, battle.arena);

            let healAction = executor.combatAction.heal;
            let availableHealTargets = healAction.getAvailableTargets(executor, battle.combatants, battle.arena);

            if(availableHealTargets) {
                healAction.pickTarget(executor, battle.combatants[availableHealTargets[randomInt(availableHealTargets.length)]])
                return healAction;
            } else if(availableTargets) {
                attackAction.pickTarget(executor, battle.combatants[availableTargets[randomInt(availableTargets.length)]])
                return attackAction;
            } else {
                return executor.combatAction.wait;
            }
        },
        key: 'leader'
    }),
}

const characterRoster = {
    orc : {
        peon: new Character({
            name: 'peon',
            race: race.Orc,
            baseHP: 10,
            baseSpeed: 0.1,
            atk: 1,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        warrior: new Character({
            name: 'warrior',
            race: race.Orc,
            baseHP: 50,
            baseSpeed: 0.3,
            atk: 5,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        warchief: new Character({
            name: 'warchief',
            race: race.Orc,
            baseHP: 100,
            baseSpeed: 0.2,
            atk: 10,
            isPlayable: false,
            combatActions: {...defaultActions, heal:actionPool.heal},
            battleAI: battleAI.leader,
        }),
    },
    human : {
        peasant: new Character({
            name: 'peasant',
            race: race.Human,
            baseHP: 8,
            baseSpeed: 0.13,
            atk: 1,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        warrior: new Character({
            name: 'warrior',
            race: race.Human,
            baseHP: 45,
            baseSpeed: 0.4,
            atk: 3,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        general: new Character({
            name: 'general',
            race: race.Human,
            baseHP: 90,
            baseSpeed: 0.3,
            atk: 8,
            isPlayable: false,
            combatActions: {...defaultActions, heal:actionPool.heal},
            battleAI: battleAI.leader,
        }),
    },
    dwarf : {
        miner: new Character({
            name: 'miner',
            race: race.Dwarf,
            baseHP: 9,
            baseSpeed: 0.10,
            atk: 2,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        warrior: new Character({
            name: 'warrior',
            race: race.Dwarf,
            baseHP: 45,
            baseSpeed: 0.45,
            atk: 3,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        commander: new Character({
            name: 'commander',
            race: race.Dwarf,
            baseHP: 95,
            baseSpeed: 0.25,
            atk: 9,
            isPlayable: false,
            combatActions: {...defaultActions, heal:actionPool.heal},
            battleAI: battleAI.leader,
        }),
    },
    elf : {
        bowyer: new Character({
            name: 'bowyer',
            race: race.Elf,
            baseHP: 6,
            baseSpeed: 0.20,
            atk: 2,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        archer: new Character({
            name: 'archer',
            race: race.Elf,
            baseHP: 30,
            baseSpeed: 0.7,
            atk: 2,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        lord: new Character({
            name: 'lord',
            race: race.Elf,
            baseHP: 90,
            baseSpeed: 0.9,
            atk: 7,
            isPlayable: false,
            combatActions: {...defaultActions, heal:actionPool.heal},
            battleAI: battleAI.leader,
        }),
    },
    goblins : {
        goblin: new Character({
            name: 'mob',
            race: race.Goblin,
            baseHP: 3,
            baseSpeed: 0.20,
            atk: 1,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        goblinWarrior: new Character({
            name: 'warrior',
            race: race.Goblin,
            baseHP: 15,
            baseSpeed: 0.7,
            atk: 1,
            isPlayable: false,
            combatActions: defaultActions,
            battleAI: battleAI.basic,
        }),
        goblinChieftan: new Character({
            name: 'warboss',
            race: race.Goblin,
            baseHP: 45,
            baseSpeed: 0.9,
            atk: 4,
            isPlayable: false,
            combatActions: {...defaultActions, heal:actionPool.heal},
            battleAI: battleAI.leader,
        }),
    }
};

/**
 * class generates random battles 
 * todo: implement power for team and units to randomize some more
 * todo: add generation params to allow some configuration for generation
 */
export default class BattleGenerator
{
    /**
     * @returns 
     */
    static generate(){
        const teamCount = randomInt(3)+2;
        const teamSize = randomInt(4)+2;
        const bType = battleType.field;
        let teams = [];

        for(let i = 0; i<teamCount; i++){
            teams.push(this.generateTeam(teamSize + randomInt(4)));
        }

        const arenaSize = teamSize*2 + 20 + randomInt(15);
        const arena = new Arena(this.generateArena(bType,arenaSize,arenaSize));

        const teamStartPos = [
            //left
            {
                x: 1,
                y: Math.ceil(arena.height/2) -1,
                dir: Phaser.Math.Vector2.RIGHT
            },
            //right
            {
                x: arena.width-2,
                y: Math.ceil(arena.height/2) -1,
                dir: Phaser.Math.Vector2.LEFT
            },
            //up
            {
                x: Math.ceil(arena.width/2) -1,
                y: 1,
                dir: Phaser.Math.Vector2.DOWN
            },
            //down
            {
                x: Math.ceil(arena.width/2) -1,
                y: arena.height-2,
                dir: Phaser.Math.Vector2.UP
            }
        ]
        
        const combatants = teams.map((team, teamIndex) => { 
            /**
             * @type {{x: number, y: number, dir: Phaser.Math.Vector2}}
             */
            const startPos = teamStartPos[teamIndex];
            const verticalDir = teamIndex < 2;
            /**
             * @type {integer}
             */
            const posOffset = Math.floor(team.length/2);
            let combatants = []
            for (const [combatantIndex, value] of Object.entries(team)) {
                const cIndex = parseInt(combatantIndex);

                let props = {
                    character: value,
                    team: teamIndex+1,
                    direction: startPos.dir,
                }

                if(verticalDir){
                    props.coordinates = new Phaser.Math.Vector2(startPos.x, startPos.y + cIndex - posOffset)
                } else {
                    props.coordinates = new Phaser.Math.Vector2(startPos.x + cIndex - posOffset,startPos.y)
                }

                combatants.push(new Combatant(props));
            }
            return combatants;
        }).flat();

        return new Battle({
            combatants: combatants,
            arena: arena,
            battleType: bType,
        });
    }

    /**
     * 
     * @param {integer} size 
     */
    static generateTeam(size){
        
        const roosterIndex = randomInt(5);
        const rosterOptions = Object.values(characterRoster)[roosterIndex];
        if(roosterIndex === 4) {
            size *= 2;
        }
        // as we currently hardcoded roster then we can hardcode size them
        // remove leader slot
        let available = size - 1; 
        // leader will be just one so we will multiply first 2 tiers
        let proportions = [0.75,0.25];
        let firstTier = Math.floor(available*proportions[0]);
        let secondTier = available - firstTier;
        let team = [];
        for(let i = 0; i<firstTier; i++){
            team.push({...Object.values(rosterOptions)[0]});
        }
        for(let i = 0; i<secondTier; i++){
            team.push({...Object.values(rosterOptions)[1]});
        }
        team.push({...Object.values(rosterOptions)[2]});

        return team;
    }

    static generateArena(bType, width, height){
        let tiles = [];
        for(let i = 0; i < height; i++){
            let row = [];
            for(let j = 0; j< width; j++){
                if(i===0||j===0||i===(height-1)||j===(width-1)){
                    row.push(0);
                } else {
                    row.push(1);
                }
            }
            tiles.push(row);
        }


        return {
            battletype: bType,
            width: width,
            height: height,
            tiles: tiles,
        }
    }
}