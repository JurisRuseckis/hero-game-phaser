import { randomInt } from "../../helpers/randomInt";
import Battle from "../Battle";
import Character, { race } from "../Character";
import { Combatant } from "../Combatant";
import CombatAction from "../CombatAction";

/**
 * @type {CombatAction[]}
 */
 const defaultActions = [
    new CombatAction({
        key: 'wait',
        operation: (executor, target) => {
            executor.turnMeter = 0;
            return `${executor.label} from team ${executor.team} waits`;
        },
        targetRules: (executor, target) => {
            return executor == target;
        }
    }),
    new CombatAction({
        key: 'attack',
        text: '',
        operation: (executor, target) => {
            executor.turnMeter = 0;
            // todo: add arena effects
            // todo: add target effects
            const dmg = executor.calculateDmg();
            target.hp -= dmg;
            return `${executor.label} from team ${executor.team} Attacks ${target.label} from team ${target.team} for ${dmg} damage!`;
        },
        targetRules: (executor, target) => {
            return executor.team != target.team;
        }
    }),
];

const characterRoster = {
    orc : {
        peon: new Character({
            name: 'peon',
            nationality: race.Orc,
            baseHP: 10,
            baseSpeed: 0.1,
            atk: 1,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        warrior: new Character({
            name: 'warrior',
            nationality: race.Orc,
            baseHP: 50,
            baseSpeed: 0.3,
            atk: 5,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        warchief: new Character({
            name: 'warchief',
            nationality: race.Orc,
            baseHP: 100,
            baseSpeed: 0.2,
            atk: 10,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
    },
    human : {
        peasant: new Character({
            name: 'peasant',
            nationality: race.Human,
            baseHP: 8,
            baseSpeed: 0.13,
            atk: 1,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        warrior: new Character({
            name: 'warrior',
            nationality: race.Human,
            baseHP: 45,
            baseSpeed: 0.4,
            atk: 3,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        general: new Character({
            name: 'general',
            nationality: race.Human,
            baseHP: 90,
            baseSpeed: 0.3,
            atk: 8,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
    },
    dwarf : {
        miner: new Character({
            name: 'miner',
            nationality: race.Dwarf,
            baseHP: 9,
            baseSpeed: 0.10,
            atk: 2,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        warrior: new Character({
            name: 'warrior',
            nationality: race.Dwarf,
            baseHP: 45,
            baseSpeed: 0.45,
            atk: 3,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        commander: new Character({
            name: 'commander',
            nationality: race.Dwarf,
            baseHP: 95,
            baseSpeed: 0.25,
            atk: 9,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
    },
    elf : {
        bowyer: new Character({
            name: 'bowyer',
            nationality: race.Dwarf,
            baseHP: 6,
            baseSpeed: 0.20,
            atk: 2,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        archer: new Character({
            name: 'archer',
            nationality: race.Dwarf,
            baseHP: 30,
            baseSpeed: 0.7,
            atk: 2,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
        lord: new Character({
            name: 'lord',
            nationality: race.Dwarf,
            baseHP: 90,
            baseSpeed: 0.9,
            atk: 7,
            isPlayable: false,
            combatActions: defaultActions,
            duelActions: [],
        }),
    },
};

const teamSeed = [
    'elf',
    'human',
    'dwarf',
    'elf',
    'custom',
]

/**
 * class generates random battles 
 * todo: implement power for team and units to randomize some more
 */
export default class BattleGenerator
{
    /**
     * 
     * @param {Phaser.Scene} scene 
     * @returns 
     */
    static generate(scene){
        const teamCount = randomInt(4+2);
        const teamSize = randomInt(5+1);
        let teams = [];

        for(let i = 0; i<teamCount; i++){
            teams.push(this.generateTeam(teamSize));
        }
        
        const combatants = teams.map((team, index) => { 

            let combatants = []
            for (const [key, value] of Object.entries(team)) {
                combatants.push(new Combatant({
                    character: value,
                    team: index+1
                }));
            }
            return combatants;
        }).flat();

        console.log(combatants);

        const battle = new Battle({
            combatants: combatants,
            scene: scene
        });

        return battle;
    }

    /**
     * 
     * @param {integer} size 
     */
    static generateTeam(size){
        const rosterOptions = [
            characterRoster.orc,
            characterRoster.human,
            characterRoster.elf,
            characterRoster.dwarf,
        ]

        return rosterOptions[randomInt(4)];
    }
}