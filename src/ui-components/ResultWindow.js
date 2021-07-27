import {styles} from "../styles";
import {uiAlignment} from "./BattleLogWindow";
import Btn from "./Btn";
import BattleGenerator from "../models/Generators/BattleGenerator";
import {cfg} from "../cfg";

export default class ResultWindow
{
    /**
     * 
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     * @param {number} props.alignment
     */
    constructor(props) {
        this.scene = props.scene;
        this.alignment = props.alignment;

        this.width = styles.isMobile ? styles.grid.window : styles.viewPort.width * 0.4;
        this.height = styles.isMobile ? styles.grid.window * 0.2 : styles.viewPort.width * 0.2;
        this.margin = styles.padding;

        if(this.alignment !== uiAlignment.middle){
            throw "not implemented";
        }

        // if middle
        this.x = styles.isMobile
            ? this.margin
            : this.scene.scale.displaySize.width / 2 - this.width / (this.scene.scale.displayScale.x * 2);

        this.y = this.scene.scale.displaySize.height / 2 - this.height / this.scene.scale.displayScale.y;


        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,this.width,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');
        const bgBoxBounds = bgBox.getBounds();

        const txt = this.scene.add.text(this.margin, this.margin,'test').setName('text').setOrigin(0);



        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
            txt,
        ]);

        const menuItems = this.getMenuItems();
        const btnWidth = this.width - styles.padding*2;
        const menuItemHeight = btnWidth * 0.15;
        const btns = menuItems.map((menuItem, index) => {
            const btn = new Btn({
                scene: this.scene,
                x: txt.x,
                y: bgBoxBounds.top + txt.height + styles.padding * 2 + index * (menuItemHeight + styles.padding),
                width: btnWidth,
                height: menuItemHeight,
                text: menuItem.label,
                textStyle: {fontSize: styles.fontSize.default}
            })
            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', menuItem.onClick, this);
            this.container.add(btn.container);
            return btn;
        });

        // scroll factor fucks up pointerOver for childrem without scrollFactor 0
        this.container.setScrollFactor(0, 0, true);
        this.container.setDepth(1);
    }

    setText(text){
        /**
         *
         * @type {Phaser.GameObjects.Text}
         */
        const txt = this.container.getByName('text');
        // if(txt){
            txt.setText(text);
        // }
    }

    update(){
        // transform viewport coordinates to game coordinates.
        const targetCoordinates  = new Phaser.Math.Vector2(this.scene.scale.transformX(this.x), this.scene.scale.transformY(this.y));
        // console.log(targetCoordinates);
        // apply to container
        this.container.setPosition(targetCoordinates.x, targetCoordinates.y);

    }

    addEventListenerToBg(event, fn, context) {
        const bg = this.container.getByName('bgBox');
        bg.on(event, fn, context);
    }

    getMenuItems ()
    {
        return [
            {
                label: "Return to Menu",
                onClick: ()=> {
                    this.scene.registry.set('transition', {
                        target: null,
                        changeLayout: true,
                        beforeTransition: (scene) => {
                            scene.stop(cfg.scenes.battleUI);
                            scene.stop(cfg.scenes.battleGrid);
                        }
                    });
                }
            },
        ]
    }

}