import Phaser from "phaser";


export const tileType = {
    wall: 0,
    dirt: 1
}

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

    /**
     * A* pathfinding
     * @param {Arena} arena
     * @param {Combatant} executor
     * @param {Phaser.Tilemaps.Tile} start
     * @param {Phaser.Tilemaps.Tile} target
     */
    static calculateShortestPath(arena, executor, start, target){
        const id = executor.id;
        // open list
        let openSet = [];
        // closed list
        let closedSet = [];
        // add start to be the first current
        start.properties[id] = []
        start.properties[id].hCost = BattleAI.getDistanceCost(start, target);
        start.properties[id].gCost = 0;
        openSet.push(start);

        target.properties[id] = []
        target.properties[id].hCost = BattleAI.getDistanceCost(target, start);
        target.properties[id].gCost = 0;

        while (openSet.length > 0){
            // sort by lowest fCost
            openSet = openSet.sort((a,b) =>
                BattleAI.getFCost(a, id) > BattleAI.getFCost(b, id)
                ? 1
                : BattleAI.getFCost(a, id) < BattleAI.getFCost(b, id)
                    ? -1
                    : a.properties[id].hCost > b.properties[id].hCost
                        ? 1
                        : a.properties[id].hCost < b.properties[id].hCost
                            ? -1
                            : 0
            )
            // pick node(current) in open list with lowest fCost
            // which is first in list now sp we can remove and receive with shift
            const currentNode = openSet.shift();
            // add current to closed list
            closedSet.push(currentNode);

            // if current == target path is found, retrace and return;
            // if(currentNode.x === target.x && currentNode.y === target.y){
            if(currentNode === target){
                return BattleAI.retrace(id, start, target);
            }

            const sq = {
                left : currentNode.x < 1 ? 0 : currentNode.x - 1,
                right : currentNode.x + 1 >= arena.width ? arena.width - 1 : currentNode.x + 1,
                top : currentNode.y < 1 ? 0 : currentNode.y - 1,
                bottom : currentNode.y + 1 >= arena.height ? arena.height - 1 : currentNode.y + 1,
            };

            const neighbours = arena.tilemap.getTilesWithin(sq.left, sq.top, sq.bottom - sq.top + 1, sq.right - sq.left + 1);
            // check each neighbour (and update each of them)
            neighbours.forEach((neighbour)=>{

                // if neighbour in closed or not traversable then next
                if( neighbour === currentNode
                    || neighbour.index === tileType.wall
                    || (neighbour.properties.cmbId && neighbour.properties.cmbId !== target.properties.cmbId)
                    || closedSet.includes(neighbour)){
                    return;
                }

                // if neighbour not in open or path from current is shorter
                const newMoveCost = currentNode.properties[id].gCost + BattleAI.getDistanceCost(currentNode, neighbour);
                const currentMoveCost = neighbour.properties[id] ? neighbour.properties[id].gCost : Infinity;
                if(!closedSet.includes(neighbour) || newMoveCost < currentMoveCost ){
                    // then set f_cost
                    if(!neighbour.properties[id]){
                        neighbour.properties[id] = [];
                    }
                    //set h
                    neighbour.properties[id].hCost = BattleAI.getDistanceCost(neighbour, target);
                    //set g
                    neighbour.properties[id].gCost = newMoveCost;
                    // set parent to current also
                    neighbour.properties[id].parentNode = currentNode;

                    //if node not in open then put it there
                    if(!openSet.includes(neighbour)){
                        openSet.push(neighbour);
                    }
                }

            });
        }

        console.log('unreachable');
        openSet.forEach(t => delete t.properties[id]);
        closedSet.forEach(t => delete t.properties[id]);
        return [];
    }

    /**
     * returns simplified distance using unit vector
     * horizontal/vertical - 1 * 10 = 10
     * diagonal - sqrt(horizontal^2 + vertical^2) -> sqrt(2) -> ~1.4 * 10 = 14
     * @param {Phaser.Tilemaps.Tile} tileFrom
     * @param {Phaser.Tilemaps.Tile} tileTo
     * @return {number}
     */
    static getDistanceCost(tileFrom, tileTo){
        const dstX = Math.abs(tileFrom.x - tileTo.x);
        const dstY = Math.abs(tileFrom.y - tileTo.y);

        if(dstX > dstY){
            return 14*dstY  + 10*(dstX-dstY);
        }

        return 14*dstX  + 10*(dstY-dstX);
    }

    /**
     *
     * @param {Phaser.Tilemaps.Tile} node
     * @param {string} id
     * @return {number}
     */
    static getFCost (node, id) {
        return node.properties[id].gCost + node.properties[id].hCost;
    }

    /**
     *
     * @param {string} id
     * @param {Phaser.Tilemaps.Tile} start
     * @param {Phaser.Tilemaps.Tile} target
     * @return {Phaser.Tilemaps.Tile[]}
     */
    static retrace(id, start, target){
        let path = []
        let current = target;

        while (current !== start){
            path.push(current);
            current = current.properties[id].parentNode;
        }

        return path.reverse();
    }
}