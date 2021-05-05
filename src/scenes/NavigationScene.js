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

        const navHeight = height*0.07;
        const navColor = 0xaf826b;
        const btnColor = 0xb16551;
        const btnBorderColor = 0x462820;
        const btnPadding = height*0.02;

        const buttonHeight = height * 0.05;

        const nav = this.add.rectangle(0,0, width, navHeight, navColor).setOrigin(0,0);
        const btn = this.add.rectangle(height * 0.01, height * 0.01, 50, buttonHeight, btnColor).setOrigin(0,0);
        btn.setStrokeStyle(2, btnBorderColor);
        const btnBounds = btn.getBounds();
        // smth wrong with buttontext it throws err
        // const btnTxt = this.add.text(btn.x + btnPadding, btnBounds.centerY, 'character').setOrigin(0, 0.5);
        // btn.setSize(btnTxt.width + btnPadding * 2, btn.height);
        btn.setInteractive();
        btn.on('pointerover', () => {
            btn.setFillStyle(btnBorderColor);
        }, this);
        btn.on('pointerout', () => {
            btn.setFillStyle(btnColor);
        }, this);
        btn.on('pointerdown', () => {
            this.scene.launch(cfg.scenes.character);
        }, this);
    }
}