import Phaser from "phaser";
import {cfg} from "../cfg";

export class LoadingScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.loading
        });
    }

    init(data)
    {
        this.sceneKey = data.sceneKey;
        this.passable = data;
    }

    preload ()
    {

    }

    create ()
    {
        const { width, height } = this.scale;

        const centerX = width * 0.5;
        const centerY = height * 0.5;

        this.add.text(centerX, centerY, 'Loading').setOrigin(0.5);
        this.scene.start(this.sceneKey, this.passable);
    }
}