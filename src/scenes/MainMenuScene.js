import Phaser from "phaser";
import {cfg} from "../cfg";

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

        const { width, height } = this.scale;

        const centerX = width * 0.5;
        const centerY = height * 0.5;

        const menuBoxColor = 0xaf826b;
        const menuBoxBorderColor = 0x574135;
        const menuPadding = height * 0.02;
        const menuWidth = width * 0.33;
        const menuBorderWidth = menuWidth * 0.006;
        const menuItemHeight = height * 0.050;
        const menuHeight =
            menuPadding +
            height * 0.0666 + // title(.0666 satan)
            menuPadding +
            menuItems.length * (menuItemHeight + menuPadding); // btn(.5) + afterpadding(.01)

        const menuBox = this.add.rectangle(centerX, centerY, menuWidth, menuHeight, menuBoxColor);
        menuBox.setStrokeStyle(menuBorderWidth, menuBoxBorderColor);
        const menuBoxBounds = menuBox.getBounds();

        const title = this.add.text(menuBox.x, menuBoxBounds.top + menuPadding, "Hero Game").setOrigin(0.5,0);

        const btnBoxColor = 0xb16551;
        const btnBoxBorderColor = 0x462820;
        const buttons = menuItems.map((menuItem, index) => {
            const btn = this.add.rectangle(menuBox.x, menuBoxBounds.top + title.width + menuPadding + index * (menuItemHeight + menuPadding), menuWidth - menuPadding*2, menuItemHeight, btnBoxColor)
                .setOrigin(0.5, 0.5);
            btn.setStrokeStyle(menuBorderWidth, btnBoxBorderColor);

            const txt = this.add.text(menuBox.x, btn.y, menuItem.label).setOrigin(0.5);

            btn.setInteractive();
            btn.on('pointerover', () => {
                btn.setFillStyle(btnBoxBorderColor);
            }, this);
            btn.on('pointerout', () => {
                btn.setFillStyle(btnBoxColor);
            }, this);
            btn.on('pointerdown', menuItem.onClick);
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