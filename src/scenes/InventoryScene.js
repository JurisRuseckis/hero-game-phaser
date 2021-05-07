import Phaser from "phaser";
import {cfg} from "../cfg";

export class InventoryScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.inventory
        });
    }

    preload ()
    {

    }

    create ()
    {
        const { width, height } = this.scale;

        const centerX = width * 0.5;
        const centerY = height * 0.5;

        this.add.text(centerX, centerY, 'Inventory');
    }
}