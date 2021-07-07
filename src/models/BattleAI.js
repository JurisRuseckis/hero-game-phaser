import Phaser from "phaser";

export default class BattleAI
{
    /**
     *
     * @param {Object} props
     * @param {string} props.key
     * @param {function} props.battleAI
     */
    constructor(props) {
        this.key = props.key;
        this.battleAI = props.battleAI;
    }


    /**
     *
     * @param {Battle} battle - for analytics
     * @param {Combatant} executor
     * @return {CombatAction}
     */
    calculateBattleAIAction(battle,executor){
        return this.battleAI(battle, executor);
    }

    /**
     *
     * @param {Combatant} executor
     * @param {Combatant[]} combatants
     * @return {{combatant: Combatant, distance: number}}
     */
    static getClosestEnemy(executor, combatants){
        return combatants.filter(c => c.team !== executor.team).map((combatant)=>{
            const executorCoords = new Phaser.Math.Vector2(executor.coordinates.x, executor.coordinates.y);
            const combatantCoords = new Phaser.Math.Vector2(combatant.coordinates.x, combatant.coordinates.y);
            return {
                combatant: combatant,
                distance: Math.round(combatantCoords.subtract(executorCoords).length()),
            }
        }).sort((a,b) => (
            a.distance > b.distance)
            ? 1
            : (a.distance < b.distance)
                ? -1
                : 0
        ).shift();
    }

    /**
     *
     * @param {{combatant: Combatant, tile: Phaser.Tilemaps.Tile}[]} availableTargets
     * @param {Phaser.Math.Vector2} targetVector
     * @param {number} minDistance
     * @return {{target:{combatant: Combatant, tile: Phaser.Tilemaps.Tile}, distance: number}}
     */
    static getClosestAvailableTileToEnemy(availableTargets, targetVector, minDistance){
        return availableTargets.map((target)=>{
            const targetCoords = new Phaser.Math.Vector2(targetVector.x, targetVector.y);
            const tileCoords = new Phaser.Math.Vector2(target.tile.x, target.tile.y);
            // todo: implement pathfinding
            return {
                target: target,
                distance: Math.round(targetCoords.subtract(tileCoords).length()),
            };
        }).filter(t => t.distance >= minDistance).sort((a,b) => (
            a.distance > b.distance)
            ? 1
            : (a.distance < b.distance)
                ? -1
                : 0
        ).shift();
    }
}