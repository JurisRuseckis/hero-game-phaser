import BattleAI from "./BattleAI";

export const battleAI = {
    // as all chars will have default actions then basic will be default for all
    basic: new BattleAI({
        key: 'basic',
        battleAI: (battle, executor) => {
            const closestEnemy = BattleAI.getClosestEnemy(executor, battle.getCombatants())
            let move = executor.combatAction.walk;
            const att = executor.combatAction.attack;
            if(closestEnemy.distance > att.range){
                // todo rewrite ai, to determine best target and move into range not into target itself
                let moveTargets = move.getAvailableTargets(executor, battle.combatants, battle.arena);

                const shortestPathToEnemy = BattleAI.calculateShortestPath(
                    battle.arena,
                    executor,
                    battle.arena.tilemap.getTileAt(executor.coordinates.x, executor.coordinates.y),
                    battle.arena.tilemap.getTileAt(closestEnemy.combatant.coordinates.x, closestEnemy.combatant.coordinates.y));

                const availableTilesToTarget = shortestPathToEnemy.filter(x => moveTargets.filter(y => y.tile === x).length === 1 && !x.properties['cmbid']);
                const sortedTiles = availableTilesToTarget.sort((a,b) =>
                        BattleAI.getFCost(a, executor.id) > BattleAI.getFCost(b, executor.id)
                            ? 1
                            : BattleAI.getFCost(a, executor.id) < BattleAI.getFCost(b, executor.id)
                            ? -1
                            : a.properties[executor.id]['hCost'] > b.properties[executor.id]['hCost']
                                ? 1
                                : a.properties[executor.id]['hCost'] < b.properties[executor.id]['hCost']
                                    ? -1
                                    : 0
                    );

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

                    if(closestTileToEnemy && move.pickTarget(executor,closestTileToEnemy.target,battle.arena)){
                        return move;
                    }
                }


            } else {
                let targetTile = battle.arena.tilemap.getTileAt(closestEnemy.combatant.coordinates.x, closestEnemy.combatant.coordinates.y)
                if(att.pickTarget(executor, {
                    tile: targetTile,
                    combatant: closestEnemy.combatant
                }, battle.arena)){
                    return att;
                }
            }

            return executor.combatAction.wait;
        }
    }),
    defensive: new BattleAI({
        key: 'defensive',
        battleAI: (battle, executor) => {
            const closestEnemy = BattleAI.getClosestEnemy(executor, battle.getCombatants())
            const att = executor.combatAction.attack;
            if(closestEnemy.distance <= att.range){
                let targetTile = battle.arena.tilemap.getTileAt(closestEnemy.combatant.coordinates.x, closestEnemy.combatant.coordinates.y)
                if(att.pickTarget(executor, {
                    tile: targetTile,
                    combatant: closestEnemy.combatant
                }, battle.arena)){
                    return att;
                }
            }

            return executor.combatAction.wait;
        }
    }),
}