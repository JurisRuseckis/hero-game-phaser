import Phaser from "phaser";
import {cfg} from "../cfg";

export class NavigationScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.navigation
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

        this.add.text(centerX, 10, 'Navigation').setOrigin(0.5);
        console.log(this.registry);
        this.scene.launch(cfg.scenes.character);
    }
}