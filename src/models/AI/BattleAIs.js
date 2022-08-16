import BattleAI, {tileType} from "./BattleAI";
import {actionTags} from "../CombatAction";

export const battleAI = {
    // as all chars will have default actions then basic will be default for all
    basic: new BattleAI({
        key: 'basic',
        battleAI: (battle, executor) => {
            const closestEnemy = BattleAI.getClosestEnemy(executor, battle.getCombatants())
            //queue should be the main way how to determine ability that will be executed
            //filter will remove abilities that are not possible (dont know if i should remove abilites that are possible but would be bad choices for tactics)
            //sort should move higher value abilities to top
            //ability value should be calculated before sort
            let abilityQueue = Object.values(executor.combatActions)
                .map((a) => {
                    // resetting execution value for each turn. Or maybe should stack for some abilities
                    a.executionValue = 0;
                    return a;
                })
                .filter((a) => a.cooldownLeft <= 0
                    && (a.range >= closestEnemy.distance || ["walk", "wait"].includes(a.key))
            );

            //will be custom value array for each tactic or maybe for each move
            const tagValues = {
                [actionTags.ranged] : 5,
                [actionTags.melee] : 2
            }

            abilityQueue = abilityQueue.map((a) => {

                // loop tags and add each tags values if there is one
                a.executionValue += a.tags
                    .map((t) => tagValues.hasOwnProperty(t) ? tagValues[t] : 0)
                    .reduce((sum, v) => sum += v, 0);

                // highest range abilities should be better
                a.executionValue += a.range;
                return a;
            })

            //ability with highest execution value will be at top
            abilityQueue = abilityQueue.sort((a, b) => (
                a.executionValue < b.executionValue)
                ? 1
                : (a.executionValue > b.executionValue)
                    ? -1
                    : 0
            )

            const chosenAbility = abilityQueue.filter((a) => abilityCalculators[a.key](battle, executor, a, closestEnemy))[0];
            return chosenAbility

            // return abilityCalculators[chosenAbility.key](battle, executor, chosenAbility, closestEnemy) ? chosenAbility : executor.combatActions.wait;
        }
    }),
    defensive: new BattleAI({
        key: 'defensive',
        battleAI: (battle, executor) => {
            const closestEnemy = BattleAI.getClosestEnemy(executor, battle.getCombatants())
            const att = executor.combatActions.attack;
            if(closestEnemy.distance <= att.range){
                let targetTile = battle.arena.tilemap.getTileAt(closestEnemy.combatant.coordinates.x, closestEnemy.combatant.coordinates.y)
                if(att.pickTarget(executor, {
                    tile: targetTile,
                    combatant: closestEnemy.combatant
                }, battle.arena)){
                    return att;
                }
            }

            return executor.combatActions.wait;
        }
    }),
}

// handles multiple types of attack
const calculateTargetable = (battle, executor, ability, closestEnemy) => {
    let targetTile = battle.arena.tilemap.getTileAt(closestEnemy.combatant.coordinates.x, closestEnemy.combatant.coordinates.y)
    if(ability.pickTarget(executor, {
        tile: targetTile,
        combatant: closestEnemy.combatant
    }, battle.arena)){
        return true;
    }

    return false;
}

const calculateMove = (battle, executor, move, closestEnemy) => {
    // console.group(executor.label)
    // todo rewrite ai, to determine best target and move into range not into target itself
    let moveTargets = move.getAvailableTargets(executor, battle.combatants, battle.arena);
    executor.moveTargets = moveTargets;
    // console.log(`available targets: ${moveTargets.map(tile => `[${tile.tile.x},${tile.tile.y}]`).join(',')}`);

    const shortestPathToEnemy = BattleAI.calculateShortestPath(
        battle.arena,
        executor,
        battle.arena.tilemap.getTileAt(executor.coordinates.x, executor.coordinates.y),
        battle.arena.tilemap.getTileAt(closestEnemy.combatant.coordinates.x, closestEnemy.combatant.coordinates.y));
    // console.log(`shortest path: ${shortestPathToEnemy.map(tile => `[${tile.x},${tile.y}]`).join(',')}`);

    const availableTilesToTarget = shortestPathToEnemy.filter(x => moveTargets.filter(y => y.tile === x).length === 1 && !x.properties['cmbid']).filter(targetTile => {
        // as we currently can only attack 1 sq apart we can surely skip tiles that are deadends
        const sq = {
            left : targetTile.x < 1 ? 0 : targetTile.x - 1,
            right : targetTile.x + 1 >= battle.arena.width ? battle.arena.width - 1 : targetTile.x + 1,
            top : targetTile.y < 1 ? 0 : targetTile.y - 1,
            bottom : targetTile.y + 1 >= battle.arena.height ? battle.arena.height - 1 : targetTile.y + 1,
        };
        // todo pick only horizontal and vertical neighbours
        const neighbours = [
            battle.arena.tilemap.getTileAt(sq.left, targetTile.y),
            battle.arena.tilemap.getTileAt(sq.right, targetTile.y),
            battle.arena.tilemap.getTileAt(targetTile.x, sq.bottom),
            battle.arena.tilemap.getTileAt(targetTile.x, sq.top),
        ];
        const blockedTiles = neighbours.filter(tile => tile.index === tileType.wall);
        return blockedTiles.length < 3;
    });
    const sortedTiles = availableTilesToTarget.sort((a,b) =>
        BattleAI.getFCost(a, executor.id) > BattleAI.getFCost(b, executor.id)
            ? -1
            : BattleAI.getFCost(a, executor.id) < BattleAI.getFCost(b, executor.id)
                ? 1
                : a.properties[executor.id].hCost > b.properties[executor.id].hCost
                    ? 1
                    : a.properties[executor.id].hCost < b.properties[executor.id].hCost
                        ? -1
                        : 0
    );
    // console.log(`sorted tiles: ${sortedTiles.map(tile => `[${tile.x},${tile.y}]`).join(',')}`);
    // const closestTileToEnemy = BattleAI.getClosestAvailableTileToEnemy(moveTargets, closestEnemy.combatant.coordinates, att.range);
    // console.log(closestTileToEnemy);
    if(sortedTiles.length>0){
        // need to make so that unit moves along the path not just to target this would help to add weights and move costs to tile
        const from = new Phaser.Math.Vector2(executor.coordinates.x, executor.coordinates.y);
        const to = new Phaser.Math.Vector2(sortedTiles[0].x, sortedTiles[0].y);
        const closestTileToEnemy = {
            target: {
                tile: sortedTiles[0],
                combatant: null
            },
            distance: Math.round(from.add(to).length()),
        };

        if(closestTileToEnemy && move.pickTarget(executor,closestTileToEnemy.target,battle.arena)) {
            // console.log(`chosen target : [${closestTileToEnemy.target.tile.x},${closestTileToEnemy.target.tile.y}]`)
            // console.log(`${executor.label} chosen path : ${shortestPathToEnemy.slice(0, shortestPathToEnemy.indexOf(closestTileToEnemy.target.tile)+1).map(tile => `[${tile.x},${tile.y}]`).join(',')}`)
            executor.currentPath = shortestPathToEnemy;
            // console.groupEnd();
            return true;
        }

        return false;
    }
    // console.groupEnd();
}

const abilityCalculators = {
    'wait' : (battle, executor, ability, closestEnemy) => {return true},
    'walk' : calculateMove,
    'attack' : calculateTargetable,
    'charge' : calculateTargetable,
    'bowAttack' : calculateTargetable,
    'throwSpear' : calculateTargetable
}