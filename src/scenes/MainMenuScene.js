import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Btn from "../ui-components/Btn";

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
        // precalculate to get box height by aspect ratio
        const btnWidth = styles.grid.window - styles.padding*2;
        const menuItemHeight = btnWidth * 0.15;

        const menuHeight =
            styles.padding * 2 + // padding before & after title
            styles.fontSize.title * 2 + // title
            menuItems.length * (menuItemHeight + styles.padding); // btn + padding between, includes last padding)

        // box itself
        this.menuBox = this.add.rectangle(styles.viewPort.centerX, styles.viewPort.centerY, styles.grid.window, menuHeight, styles.colors.modernBg);
        this.menuBox.setStrokeStyle(styles.borderWidth, styles.colors.modernBorder);
        const menuBoxBounds = this.menuBox.getBounds();
        const title = this.add.text(this.menuBox.x, menuBoxBounds.top + styles.padding, "army composer\nstone age", {fontSize: styles.fontSize.title, align: 'center'}).setOrigin(0.5,0);

        this.buttons = menuItems.map((menuItem, index) => {
            const btn = new Btn({
                scene: this,
                x: this.menuBox.x - btnWidth/2,
                y: menuBoxBounds.top + title.height + styles.padding * 2 + index * (menuItemHeight + styles.padding),
                width: btnWidth,
                height: menuItemHeight,
                text: menuItem.label,
                textStyle: {fontSize: styles.fontSize.large}
            })
            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', menuItem.onClick);
            return btn;
        })

    }

    getMenuItems ()
    {
        return [
            {
                label: "New Game",
                onClick: ()=>{
                    // this.scene.start(cfg.scenes.navigation);
                    this.scene.start(cfg.scenes.loading, {
                        sceneKey: cfg.scenes.navigation,
                    });
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