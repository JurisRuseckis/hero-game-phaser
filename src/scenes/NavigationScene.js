import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Btn from "../ui-components/Btn";

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

        this.nav = this.add.rectangle(0,0, styles.viewPort.width, styles.panelLayout.navHeight, styles.colors.windowBg).setOrigin(0,0);

        this.buttons = menuItems.map((menuItem, index) => {
            const btn = new Btn({
                scene: this,
                x: styles.padding + index * (120 + styles.padding),
                y: styles.padding,
                width: 120,
                height: btnHeight,
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
                label: "ch",
                onClick: ()=>{
                    this.changeScene(cfg.scenes.character);
                }
            },
            {
                label: "inv",
                onClick: ()=>{
                    this.changeScene(cfg.scenes.inventory);
                }
            },
            {
                label: "battle",
                onClick: ()=>{
                    this.changeScene(cfg.scenes.battle);
                }
            },
            {
                label: "grid",
                onClick: ()=>{
                    this.changeScene(cfg.scenes.battleGrid, false);
                }
            },
        ]
    }

    /**
     *
     * @param {string} targetscene
     * @param {boolean} changeLayout
     */
    changeScene(targetscene, changeLayout = false)
    {
        const currentScene = this.registry.get('currentScene');
        if(currentScene === targetscene) return;

        if(changeLayout){
            this.scene.start(targetscene);
        }

        if(currentScene){
            const currentSceneObj = this.scene.get(currentScene)
            currentSceneObj.scene.transition({
                target: targetscene,
                duration: 50
            });
        } else{
            this.scene.launch(targetscene);
        }

        this.registry.set('currentScene', targetscene);
    }
}