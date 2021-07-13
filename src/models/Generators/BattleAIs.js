import BattleAI from "../BattleAI";

export const battleAI = {
    // as all chars will have default actions then basic will be default for all
    basic: new BattleAI({
        key: 'basic',
        battleAI: (battle, executor) => {
            const closestEnemy = BattleAI.getClosestEnemy(executor, battle.getCombatants())
            let x = executor.combatAction.walk;
            const att = executor.combatAction.attack;
            if(closestEnemy.distance > att.range){
                let xTargets = x.getAvailableTargets(executor, battle.combatants, battle.arena);
                const closestTileToEnemy = BattleAI.getClosestAvailableTileToEnemy(xTargets, closestEnemy.combatant.coordinates, att.range);
                if(closestTileToEnemy && x.pickTarget(executor,closestTileToEnemy.target,battle.arena)){
                    return x;
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
}