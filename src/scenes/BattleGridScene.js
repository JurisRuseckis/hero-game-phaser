import Phaser from "phaser";
import {cfg} from "../cfg";
import tileSetImage from "../assets/tileset.png";
import Debugger from "../models/Debugger";
import BattleCameraController from "../controllers/BattleCameraController";

export class BattleGridScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.battleGrid
        });

        this.turndelay = 100;
        this.turnTimer = 0;
        this.turnCount = 0;
        this.tileSize = 32;
    }

    preload ()
    {
        this.load.image('battleTileset', tileSetImage);
    }

    create ()
    {
        const grid = [];
        for(let i = 0; i < 100; i++){
            let row = [];
            for(let j = 0; j< 100; j++){
                if(i===0||j===0||i===99||j===99){
                    row.push(0);
                } else {
                    row.push(1);
                }
            }
            grid.push(row);
        }

        this.map = this.make.tilemap({ tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileSet = this.map.addTilesetImage('battleTileset', null, this.tileSize, this.tileSize, 0, 0);
        const tileGridLayer = this.map.createBlankLayer('tileGridLayer', tileSet, 0, 0, this.tileSize * grid[0].length, grid.length);
        this.map.putTilesAt(grid, 0, 0, true, tileGridLayer);

        this.debugger = new Debugger({
            scene: this,
        });
        
        this.cameraController = new BattleCameraController({
            scene: this,
        });
    }

    update(time, delta){
        // this.turnTimer += delta;
        // // as sometimes we can lag a bit we do a loop 
        // while (this.turnTimer > this.turndelay) {
            
        // }

        this.cameraController.checkBtns();
    }
}