import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";

export class MainMenuScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.mainMenu
        });
    }

    preload ()
    {

    }

    create ()
    {
        // will need to load save here
        const menuItems = this.getMenuItems();
        const menuItemHeight = 50;
        const menuHeight =
            styles.padding * 2 + // padding before & after title
            styles.defaultTextHeight + // title
            menuItems.length * (menuItemHeight + styles.padding); // btn + padding between, includes last padding)

        const menuBox = this.add.rectangle(styles.viewPort.centerX, styles.viewPort.centerY, styles.grid.window, menuHeight, styles.colors.windowBg);
        menuBox.setStrokeStyle(styles.borderWidth, styles.colors.windowBorder);
        const menuBoxBounds = menuBox.getBounds();
        const title = this.add.text(menuBox.x, menuBoxBounds.top + styles.padding, "Hero Game").setOrigin(0.5,0);

        const buttons = menuItems.map((menuItem, index) => {
            const btn = this.add.rectangle(
                menuBox.x,
                menuBoxBounds.top + title.height + styles.padding * 2 + index * (menuItemHeight + styles.padding),
                styles.grid.window - styles.padding*2,
                menuItemHeight,
                styles.colors.btnBg
            ).setOrigin(0.5, 0);

            btn.setStrokeStyle(styles.borderWidth, styles.colors.windowBorder);
            const btnCenter = btn.getCenter();
            console.log(btnCenter.y);
            const txt = this.add.text(menuBox.x, btnCenter.y, menuItem.label).setOrigin(0.5);

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
                label: "New Game",
                onClick: ()=>{
                    this.scene.start(cfg.scenes.navigation);
                    // this.scene.start(cfg.scenes.loading, {
                    //     sceneKey: cfg.scenes.navigation,
                    // });
                    this.registry.set('test', 'register is alive');
                }
            },
            {
                label: "Import Save",
                onClick: ()=>{
                    console.log("Import Save");
                    this.registry.set('import', 'Importing game');
                }
            }
        ]
    }
}