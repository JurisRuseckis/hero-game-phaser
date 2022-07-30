export default class Arena
{
    constructor(props) {
        this.width = props.width;
        this.height = props.height;
        this.tiles = props.tiles;
        this.tilemap = null;
    }
}