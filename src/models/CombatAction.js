import Phaser from "phaser";

export const actionTags = {
    any: 'any',
    ground: 'ground',
    singleCombatant: 'singleCombatant',
    targetable: 'targetable',
    ranged: 'ranged',
    melee: 'melee'
}

export default class CombatAction
{
    /**
     *
     * @param {Object} props
     * @param {string} props.key
     * @param {number} props.cooldown
     * @param {number[]} props.tags
     * @param {number} props.range
     * @param {function} props.operation
     * @param {function} props.targetRules
     */
    constructor(props) {
        this.key = props.key;

        this.operation = props.operation;
        this.targetRules = props.targetRules;

        this.cooldown = props.cooldown;
        this.cooldownLeft = 0;

        this.tags = props.tags;
        //mby should add min range
        this.range = props.range;

        this.executionValue=0;

        /**
         * filled after action is picked
         * @var {Object}
         */
        this.target = null;
    }

    /**
     *
     * @param {Combatant} combatant
     * @param {Arena} arena
     * @return {string}
     * todo: add multiple target options
     */
    applyActionEffects(combatant,arena) {
        let actionTxt = this.operation(combatant, this.target, arena);
        this.cooldownLeft = this.cooldown;
        return actionTxt;
    }

    onCooldown(){
        return this.cooldownLeft > 0;
    }

    /**
     * validates and sets target
     * @param {Combatant} executor
     * @param {{combatant: Combatant, tile: Phaser.Tilemaps.Tile}} target
     * @param {Arena} arena
     * @param {Combatant} target.combatant
     * @param {Phaser.Math.Vector2} target.tile
     * @returns {boolean}
     */
    pickTarget(executor,target, arena){

        //check if target tile is in range
        const executorCoords = new Phaser.Math.Vector2(executor.coordinates.x, executor.coordinates.y);
        const targetCoords = new Phaser.Math.Vector2(target.tile.x, target.tile.y);
        const dist = Math.round(targetCoords.subtract(executorCoords).length());
        if(dist > this.range){
            return false;
        }

        if(!this.targetRules(executor, target, arena)){
            return false;
        }
        
        this.target = target;
        return true;
    }

    /**
     * returns indices of combatants that qualifies as targets for this action
     * @param {Combatant} executor 
     * @param {Combatant[]} combatants
     * @param {Arena} arena
     * @returns {{combatant: Combatant, tile: Phaser.Tilemaps.Tile}[]} indices of given array
     */
    getAvailableTargets(executor, combatants, arena){
        let availableTargets = [];


        const rSq = this.range * this.range;
        const sq = {
            left : executor.coordinates.x - this.range < 0 ? 0 : executor.coordinates.x - this.range,
            right : executor.coordinates.x + this.range >= arena.width ? arena.width - 1 : executor.coordinates.x + this.range,
            top : executor.coordinates.y - this.range < 0 ? 0 : executor.coordinates.y - this.range,
            bottom : executor.coordinates.y + this.range >= arena.height ? arena.height - 1 : executor.coordinates.y + this.range,
        }

        for(let col = sq.left; col <= sq.right; col++){
            for(let row = sq.top; row <= sq.bottom; row++){
                const dy = executor.coordinates.y - row;
                const dx = executor.coordinates.x - col;
                const distSq = dy * dy + dx * dx;
                if(distSq <= rSq){
                    // if tile is in range then push all the things needed to availableTargets
                    const tile = arena.tilemap.getTileAt(col, row);
                    // there should always be tile at this point
                    let target = {
                        tile: tile
                    }

                    if(this.tags.includes(actionTags.targetable)){
                        const cmbId = tile.properties['cmbId'];
                        if(cmbId){
                            target.combatant = combatants.find(c => c.id === cmbId);
                            if(target.combatant && this.targetRules(executor, target, arena)){
                                availableTargets.push(target);
                            }

                        }
                    } else {
                        if(this.targetRules(executor, target, arena)){
                            availableTargets.push(target);
                        }
                    }
                }
            }
        }

        return availableTargets;
    }
}