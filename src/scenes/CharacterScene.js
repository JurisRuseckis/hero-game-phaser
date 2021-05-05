import Phaser from "phaser";
import {cfg} from "../cfg";

export class CharacterScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.character
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

        this.add.text(centerX, centerY, 'Character').setOrigin(0.5);
    }
}