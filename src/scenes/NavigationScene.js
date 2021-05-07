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
        const menuItems = this.getMenuItems();
        const btnHeight = styles.panelLayout.navHeight - styles.padding * 2;

        const nav = this.add.rectangle(0,0, styles.viewPort.width, styles.panelLayout.navHeight, styles.colors.windowBg).setOrigin(0,0);

        const buttons = menuItems.map((menuItem, index) => {
            const btn = this.add.rectangle(
                styles.padding + index * (50 + styles.padding),
                styles.padding,
                50,
                btnHeight,
                styles.colors.btnBg
            ).setOrigin(0,0);

            btn.setStrokeStyle(styles.borderWidth, styles.colors.windowBorder);
            const btnCenter = btn.getCenter();
            // smth wrong with buttontext it throws err
            const txt = this.add.text(btnCenter.x, btnCenter.y, menuItem.label, {fontSize: styles.fontSize.large}).setOrigin(0.5);

            btn.setInteractive();
            btn.on('pointerover', () => {
                btn.setFillStyle(styles.colors.btnBorder);
            }, this);
            btn.on('pointerout', () => {
                btn.setFillStyle(styles.colors.btnBg);
            }, this);
            btn.on('pointerdown', menuItem.onClick);

            return {btn, txt};
        })
    }

    getMenuItems ()
    {
        return [
            {
                label: "ch",
                onClick: ()=>{
                    this.scene.launch(cfg.scenes.character);
                    this.registry.set('test', 'register is alive');
                }
            },
            {
                label: "inv",
                onClick: ()=>{
                    this.scene.launch(cfg.scenes.inventory);
                    this.registry.set('import', 'Importing game');
                }
            }
        ]
    }
}