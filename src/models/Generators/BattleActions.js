import CombatAction, {actionTags} from "../CombatAction";
import Phaser from "phaser";
import BattleAI, {tileType} from "../AI/BattleAI";

export const combatActions = {
    // add charge so combatant can damage someone with moving
    wait: new CombatAction({
        key: 'wait',
        tags: [actionTags.any],
        range: 0,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            return `${executor.label} from team ${executor.team} waits`;
        },
        targetRules: (executor, target, arena) => {
            return true;
        }
    }),
    walk:  new CombatAction({
        key: 'walk',
        tags: [actionTags.any],
        range: 2,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            const init = new Phaser.Math.Vector2(executor.coordinates.x, executor.coordinates.y);
            executor.coordinates.set(target.tile.x, target.tile.y);
            return `${executor.label} from team ${executor.team} walks from tile at [${init.x},${init.y}] to tile at [${target.tile.x},${target.tile.y}]`;
        },
        targetRules: (executor, target, arena) => {
            // todo: make it possible to move more than 2 tiles
            // const shortestPathToEnemy = BattleAI.calculateShortestPath(
            //     arena,
            //     executor,
            //     arena.tilemap.getTileAt(executor.coordinates.x, executor.coordinates.y),
            //     arena.tilemap.getTileAt(target.tile.x, target.tile.y));

            // calculate
            const dX = executor.coordinates.x - target.tile.x;
            const dY = executor.coordinates.y - target.tile.y;
            // curently max == 2 so no diagonals and only 1 tile to check
            let middleTile = false;
            if(Math.abs(dX) > 1){
                middleTile = arena.tilemap.getTileAt(target.tile.x+dX/2,target.tile.y);
            } else if (Math.abs(dY) > 1){
                middleTile = arena.tilemap.getTileAt(target.tile.x,target.tile.y+dY/2);
            }

            if(middleTile && middleTile.index == tileType.wall){
                return false;
            }

            return !target.tile.properties['cmbId']
                && target.tile.index !== tileType.wall
                && !(target.tile.x === executor.coordinates.x
                    && target.tile.y === executor.coordinates.y)
        }
    }),
    attack: new CombatAction({
        key: 'attack',
        tags: [actionTags.targetable],
        range: 1,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            const dmg = executor.calculateDmg();
            target.combatant.hp -= dmg;
            return `${executor.label} from team ${executor.team} attacks ${target.combatant.label} from team ${target.combatant.team} for ${dmg} damage!`;
        },
        targetRules: (executor, target, arena) => {
            return executor.team !== target.combatant.team;
        }
    }),
    charge: new CombatAction({
        key: 'charge',
        tags: [actionTags.targetable],
        range: 2,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            
            // calculate
            const dX = executor.coordinates.x - target.tile.x;
            const dY = executor.coordinates.y - target.tile.y;
            // curently max == 2 so no diagonals and only 1 tile to check
            let middleTile = false;
            if(Math.abs(dX) > 1){
                middleTile = arena.tilemap.getTileAt(target.tile.x+dX/2,target.tile.y);
            } else if (Math.abs(dY) > 1){
                middleTile = arena.tilemap.getTileAt(target.tile.x,target.tile.y+dY/2);
            }

            executor.coordinates.set(middleTile.x, middleTile.y);
            
            const dmg = executor.calculateDmg();
            target.combatant.hp -= dmg;


            return `${executor.label} from team ${executor.team} charges at ${target.combatant.label} from team ${target.combatant.team} for ${dmg} damage!`;
        },
        targetRules: (executor, target, arena) => {
            // calculate
            const dX = executor.coordinates.x - target.tile.x;
            const dY = executor.coordinates.y - target.tile.y;
            // curently max == 2 so no diagonals and only 1 tile to check
            let middleTile = false;
            if(Math.abs(dX) > 1){
                middleTile = arena.tilemap.getTileAt(target.tile.x+dX/2,target.tile.y);
            } else if (Math.abs(dY) > 1){
                middleTile = arena.tilemap.getTileAt(target.tile.x,target.tile.y+dY/2);
            }

            return middleTile
                && !middleTile.properties['cmbId']
                && middleTile.index !== tileType.wall
                && executor.team !== target.combatant.team
        }
    }),
    bowAttack: new CombatAction({
        key: 'bowAttack',
        tags: [actionTags.targetable],
        range: 3,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            
            const dmg = executor.calculateDmg();
            target.combatant.hp -= dmg;

            return `${executor.label} from team ${executor.team} shoots arrow at ${target.combatant.label} from team ${target.combatant.team} for ${dmg} damage!`;
        },
        targetRules: (executor, target, arena) => {
            // calculate
            const dX = executor.coordinates.x - target.tile.x;
            const dY = executor.coordinates.y - target.tile.y;
            // curently max == 2 so no diagonals and only 1 tile to check
            let middleTile = false;
            const executorTile = arena.tilemap.getTileAt(executor.coordinates.x,executor.coordinates.y);
            const distance = BattleAI.getDistanceCost(executorTile,target.tile);
            
            let tilesBlocking = true;
            let middleTiles = [];
            if(distance > 0 && distance <= 1.4){
                // when no tiles are between
                tilesBlocking=true;
            } else if (distance <= 2){
                // 1 tile between

            } else if(distance <=3){
                // 2 tiles between
                
            } else {
                return false;
            }

            return middleTile.index !== tileType.wall
                && executor.team !== target.combatant.team
        }
    })
}

// -,- -,- -,- 3,0 -,- -,- -,-
// -,- 2,8 2,4 2,0 2,4 2,8 -,-
// -,- 2,4 1,4 1,0 1,4 2,4 -,-
// 3,0 2,0 1,0 0,0 1,0 2,0 3,0
// -,- 2,4 1,4 1,0 1,4 2,4 -,-
// -,- 2,8 2,4 2,0 2,4 2,8 -,-
// -,- -,- -,- 3,0 -,- -,- -,-