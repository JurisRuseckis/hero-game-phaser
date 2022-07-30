import Phaser from "phaser";
import {rotateMatrix} from "../helpers/rotateMatrix";

export default class Squad
{
    /**
     *
     * @param {Object} props
     * @param {Character[][]} props.formation
     * @param {Phaser.Math.Vector2} props.coordinates
     * @param {Phaser.Math.Vector2} props.direction
     */
    constructor(props) {
        // divide team's army into squads etc to enable multiple formations and multiple field commanders
        this.formation = props.formation;
        this.coordinates = props.coordinates;

        // this.characters = this.formation.flat().filter(c => c instanceof Character);
        this.height = this.formation.length;
        this.width = Math.max(...this.formation.map(r => r.length));
        /**
         * default direction will be to right(from player side) by default
         * @type {Phaser.Math.Vector2}
         */
        this.direction = props.direction || Phaser.Math.Vector2.RIGHT;
    }

    /**
     * rotates formation to position
     * @param {Phaser.Math.Vector2} direction target vector will snap to 90 degrees
     */
    rotateFormation(direction){
        if(direction.x + direction.y > 1){
            direction.normalize();
        }

        // probably everything will be f-up by js references
        this.formation = rotateMatrix(this.formation, this.direction, direction);
        return this.formation;
    }

    recalculateDimensions(){
        this.height = this.formation.length;
        this.width = Math.max(...this.formation.map(r => r.length));
    }

    printFormation(){
        return this.formation.map(r => r.map(c => c.name))
    }

    getLargestDimension() {
        return Math.max(this.width, this.height);
    }
}