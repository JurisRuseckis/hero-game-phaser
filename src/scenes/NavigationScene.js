import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";

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
        const btnHeight = 30;
        const navHeight = styles.padding * 2 + btnHeight;

        const nav = this.add.rectangle(0,0, styles.viewPort.width, navHeight, styles.colors.windowBg).setOrigin(0,0);
        const btn = this.add.rectangle(styles.padding, styles.padding, 50, btnHeight, styles.colors.btnBg).setOrigin(0,0);
        btn.setStrokeStyle(2, styles.colors.btnBorder);
        const btnBounds = btn.getBounds();

        // smth wrong with buttontext it throws err
        const btnTxt = this.add.text(btn.x + styles.padding, btnBounds.centerY, 'char', {fontSize: styles.fontSize.large}).setOrigin(0, 0.5);
        btn.setSize(btnTxt.width + styles.padding * 2, btn.height);

        btn.setInteractive();
        btn.on('pointerover', () => {
            btn.setFillStyle(styles.colors.btnBorder);
        }, this);
        btn.on('pointerout', () => {
            btn.setFillStyle(styles.colors.btnBg);
        }, this);
        btn.on('pointerdown', () => {
            this.scene.launch(cfg.scenes.character);
        }, this);
    }
}