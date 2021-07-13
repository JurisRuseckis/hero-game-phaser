import {randomInt} from "../../helpers/randomInt";
import Battle, { battleType } from "../Battle";
import {Combatant} from "../Combatant";
import Arena from "../Arena";
import Phaser from "phaser";
import {characterRoster} from "./Characters";

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
    static generate(preparedTeams){
        const teamCount = 4;
        const teamSize = 20;
        const bType = battleType.field;
        let teams = [];

        for(let i = 0; i<teamCount; i++){
            teams.push(this.generateTeam(teamSize));
        }

        const arenaSize = Math.max(...teams.map(r => r.length)) + 4;
        const arena = new Arena(this.generateArena(bType,arenaSize,arenaSize));

        const teamStartPos = [
            //left
            {
                x: 1,
                y: Math.ceil(arena.height/2) -1,
                dir: new Phaser.Math.Vector2(1, 0)
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