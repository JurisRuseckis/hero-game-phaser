import {randomInt} from "../../helpers/randomInt";
import Battle, { battleType } from "../Battle";
import {Combatant} from "../Combatant";
import Arena from "../Arena";
import Phaser from "phaser";
import {characterRoster} from "./Characters";
import BattleTeam from "../BattleTeam";
import {tileType} from "../AI/BattleAI";

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
    static generate(props){
        const teamCount = props.teamCount || 4;
        const teamSize = props.teamSize || 16;
        const bType = battleType.field;
        let teams = props.teams || [];

        for(let i = 0; i<teamCount; i++){
            if(!teams[i]){
                teams.push(this.generateTeam(teamSize));
            }
        }

        const arenaSize = Math.max(...teams.map(r => r.formation.length)) * 4 + 10;
        let arenaprops = props.arenaTiles
            ? {
                battletype: bType,
                width: props.arenaTiles[0].length,
                height: props.arenaTiles.length,
                tiles: props.arenaTiles,
            }
            : this.generateArena(bType,arenaSize,arenaSize);
        const arena = new Arena(arenaprops);

        const teamStartPos = [
            //left
            {
                x: 1,
                y: Math.ceil(arena.height/2) -1,
                // dir: new Phaser.Math.Vector2(1, 0)
                dir: Phaser.Math.Vector2.RIGHT,
                reverse: false
            },
            //right
            {
                x: arena.width-2,
                y: Math.ceil(arena.height/2) -1,
                dir: Phaser.Math.Vector2.LEFT,
                reverse: true
            },
            //up
            {
                x: Math.ceil(arena.width/2) -1,
                y: 1,
                dir: Phaser.Math.Vector2.DOWN,
                reverse: false
            },
            //down
            {
                x: Math.ceil(arena.width/2) -1,
                y: arena.height-2,
                dir: Phaser.Math.Vector2.UP,
                reverse: true
            }
        ]
        
        const combatants = teams.map((team, teamIndex) => { 
            /**
             * @type {{x: number, y: number, dir: Phaser.Math.Vector2, reverse: boolean}}
             */
            const startPos = teamStartPos[teamIndex];
            const verticalDir = teamIndex < 2;
            /**
             * @type {integer}
             */
            const posOffset = Math.floor(team.formation.length/2);
            team.rotateFormation(startPos.dir);
            if(verticalDir && startPos.reverse){
               startPos.x -= team.formation[0].length;
            }

            if(!verticalDir && startPos.reverse){
                startPos.y -= team.formation.length;
            }

            return team.formation.map((r,yi) => r.map((combatant, xi) => {
                if(combatant === 0) return 0;

                let props = {
                    character: combatant,
                    team: teamIndex+1,
                    direction: startPos.dir,
                }
                if(verticalDir){
                    props.coordinates = new Phaser.Math.Vector2(startPos.x + xi, startPos.y + yi - posOffset)
                } else {
                    props.coordinates = new Phaser.Math.Vector2(startPos.x + xi - posOffset,startPos.y + yi)
                }

                return new Combatant(props);
            })).flat().filter(c => c !== 0);
        }).flat();

        return new Battle({
            combatants: combatants,
            arena: arena,
            battleType: bType,
            // todo: implement debug somewhere in root
            debugMode: false
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
        let chars = [];
        for(let i = 0; i<firstTier; i++){
            chars.push({...Object.values(rosterOptions)[0]});
        }
        for(let i = 0; i<secondTier; i++){
            chars.push({...Object.values(rosterOptions)[1]});
        }
        chars.push({...Object.values(rosterOptions)[2]});

        let formation = [];
        while (chars.length) {
            formation.push(chars.splice(0,4));
        }

        return new BattleTeam({
            formation: formation
        });
    }

    static generateArena(bType, width, height){
        const centerRadius = 6

        let tiles = [];
        for(let i = 0; i < height; i++){
            let row = [];
            for(let j = 0; j< width; j++){
                if(i===0
                    ||j===0
                    ||i===(height-1)
                    ||j===(width-1)
                    // ||i > Math.round((height-1)/2) - centerRadius && i < Math.round((height-1)/2) + centerRadius
                    // &&j > Math.round((width-1)/2) - centerRadius && j < Math.round((width-1)/2) + centerRadius
                ){
                    row.push(tileType.wall);
                } else {
                    row.push(tileType.dirt);
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