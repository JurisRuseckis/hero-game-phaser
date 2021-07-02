import { battleType } from "./Battle";

export default class Arena
{
    constructor(props) {
        this.battletype = props.battletype;
        if(this.battletype === battleType.field){
            this.width = props.width;
            this.height = props.height;
            this.tiles = props.tiles;
        }
    }
}