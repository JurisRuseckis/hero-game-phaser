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

        const nav = this.add.rectangle(0,0, styles.viewPort.width, styles.panelLayout.navHeight, styles.colors.modernBg).setOrigin(0,0);

        const buttons = menuItems.map((menuItem, index) => {
            const btn = new Btn({
                scene: this,
                x: styles.padding + index * (styles.panelLayout.navBtnWidth + styles.padding),
                y: styles.padding,
                width: styles.panelLayout.navBtnWidth,
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
                label: "grid",
                onClick: ()=>{
                    this.changeScene(cfg.scenes.battleGrid, true);
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