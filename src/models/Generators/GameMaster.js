import {randomInt} from "../../helpers/randomInt";
import {Combatant} from "../Combatant";
import Arena from "../Arena";
import Phaser from "phaser";
import {characterRoster} from "./Characters";
import Army from "../Army";
import {tileType} from "../AI/BattleAI";
import Squad from "../Squad";
import Battle from "../Battle";

const deploymentOrientations = {
    horizontal: 0,
    vertical: 1
}

/**
 * class generates random battles 
 * todo: implement power for team and units to randomize some more
 * todo: add generation params to allow some configuration for generation
 */
export default class GameMaster
{
    /**
     *
     * @param {Scenario} scenario
     * @returns {Battle}
     */
    static setupBattle(scenario){
        const teams = this.getTeams(scenario);
        scenario.armies = teams;
        const arena = this.getArena(scenario);
        let deploymentTiles = this.getDeployableTiles(arena);
        const combatants = this.getCombatants(teams,arena);

        return new Battle({
            combatants: combatants,
            arena: arena,
            deploymentTiles: deploymentTiles,
            // todo: implement debug somewhere in root
            debugMode: false,
        });
    }

    /**
     *
     * @param teams
     * @param arena
     * @returns {*}
     */
    static getCombatants(teams, arena) {
        const teamStartPos = this.generateStartPositions(arena)
        return teams.map((team, teamIndex) => {
            const verticalDir = teamIndex < 2;

            return team.squads.map((squad) => {

                if(!squad.coordinates){
                    // this means that this army is generated
                    squad.formation = squad.rotateFormation(teamStartPos[teamIndex].dir);
                    squad.recalculateDimensions();
                    squad.direction = teamStartPos[teamIndex].dir;

                    const middlePointOffset = Math.floor(squad.formation.length/2);
                    const wallOffset = teamStartPos[teamIndex].reverse
                        ? (verticalDir ? squad.width : squad.height) - 1
                        : 0

                    squad.coordinates = verticalDir
                        ? new Phaser.Math.Vector2(teamStartPos[teamIndex].x - wallOffset, teamStartPos[teamIndex].y - middlePointOffset)
                        : new Phaser.Math.Vector2(teamStartPos[teamIndex].x - middlePointOffset, teamStartPos[teamIndex].y - wallOffset);

                }

                return squad.formation.map((r,yi) => r.map((combatant, xi) => {
                    if(combatant === 0 || !combatant) return 0;

                    return new Combatant({
                        character: combatant,
                        team: teamIndex+1,
                        direction: squad.direction,
                        coordinates: new Phaser.Math.Vector2(squad.coordinates.x + xi, squad.coordinates.y + yi)
                    });
                }));
            }).flat(2).filter(c => c !== 0);
        }).flat();
    }

    /**
     *
     * @param scenario
     * @returns {unknown[]}
     */
    static getTeams(scenario) {
        return scenario.armies.map((army) => {
            if(army.squads.length < 1){
                return this.generateTeam(17);
            }
            return army;
        })
    }

    /**
     * generates random team
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

        return new Army({
            squads: [
                new Squad({
                    formation: formation
                })
            ]
        });
    }

    /**
     * Setups from scenario or generates arena
     * @param scenario
     * @returns {Arena}
     */
    static getArena(scenario){
        let arenaprops;
        if(scenario.arena.length > 0){
            arenaprops = {
                width: scenario.arena[0].length,
                height: scenario.arena.length,
                tiles: scenario.arena,
            };
        } else {
            const arenaSize = Math.max(4,...scenario.armies.map(r => r.getLargestDimension())) + 20;
            arenaprops = this.generateArena(arenaSize,arenaSize);
        }
        return new Arena(arenaprops);
    }

    /**
     *
     * @param width
     * @param height
     * @returns {{tiles: *[], width, height}}
     */
    static generateArena(width, height){
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
            width: width,
            height: height,
            tiles: tiles,
        }
    }

    /**
     *
     * @param arena
     * @returns {*[]}
     */
    static getDeployableTiles(arena){
        let deploymentTiles = []
        const startPos = this.generateStartPositions(arena)[0];
        const secondDimensionLength = startPos.deploymentOrientation === deploymentOrientations.vertical
            ? arena.height - 1
            : arena.width - 1;
        for (let i = 1; i < 7; i++){
            for(let j = 1; j < secondDimensionLength; j++){
                deploymentTiles.push(startPos.deploymentOrientation === deploymentOrientations.vertical
                    ? new Phaser.Math.Vector2(i,j)
                    : new Phaser.Math.Vector2(j,i))
            }
        }
        return deploymentTiles
    }

    /**
     *
     * @param arena
     * @returns {{deploymentOrientation: number, x: number, y: number, dir: Phaser.Math.Vector2, reverse: boolean}[]}
     */
    static generateStartPositions(arena){
        return [
            //left
            {
                x: 1,
                y: Math.ceil(arena.height/2) -1,
                // dir: new Phaser.Math.Vector2(1, 0)
                dir: Phaser.Math.Vector2.RIGHT,
                reverse: false,
                deploymentOrientation: deploymentOrientations.vertical
            },
            //right
            {
                x: arena.width-2,
                y: Math.ceil(arena.height/2) -1,
                dir: Phaser.Math.Vector2.LEFT,
                reverse: true,
                deploymentOrientation: deploymentOrientations.vertical
            },
            //up
            {
                x: Math.ceil(arena.width/2) -1,
                y: 1,
                dir: Phaser.Math.Vector2.DOWN,
                reverse: false,
                deploymentOrientation: deploymentOrientations.horizontal
            },
            //down
            {
                x: Math.ceil(arena.width/2) -1,
                y: arena.height-2,
                dir: Phaser.Math.Vector2.UP,
                reverse: true,
                deploymentOrientation: deploymentOrientations.horizontal
            }
        ]
    }
}