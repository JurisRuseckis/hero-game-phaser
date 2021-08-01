import {styles} from "../styles";
import {uiAlignment} from "./BattleLogWindow";
import Btn from "./Btn";
import {cfg} from "../cfg";

export default class QuickMenu {
    /**
     * 
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     * @param {number} props.alignment
     */
    constructor(props) {
        this.scene = props.scene;
        this.alignment = props.alignment;

        if(this.alignment !== uiAlignment.topRight){
            throw "not implemented";
        }

        const menuItems = this.getMenuItems();
        const btnSize = styles.viewPort.width * 0.02;

        this.margin = styles.padding;
        this.width = menuItems.length * (btnSize + this.margin) + this.margin;
        this.height = btnSize + this.margin * 2;

        // if topRight
        this.x = this.scene.scale.displaySize.width - (this.width + this.margin) / this.scene.scale.displayScale.x;

        this.y = this.margin / this.scene.scale.displayScale.y;


        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,this.width,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');

        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
        ]);

        const btns = menuItems.map((menuItem, index) => {
            const btn = new Btn({
                scene: this.scene,
                x: this.margin + index * (btnSize + this.margin),
                y: this.margin,
                width: btnSize,
                height: btnSize,
                text: menuItem.label,
                textStyle: {fontSize: styles.fontSize.default}
            });
            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', menuItem.onClick, this);
            this.container.add(btn.container);
            return btn;
        });

        // scroll factor fucks up pointerOver for childrem without scrollFactor 0
        this.container.setScrollFactor(0, 0, true);
        this.container.setDepth(1);
    }

    update(){
        // transform viewport coordinates to game coordinates.
        const targetCoordinates  = new Phaser.Math.Vector2(this.scene.scale.transformX(this.x), this.scene.scale.transformY(this.y));
        // console.log(targetCoordinates);
        // apply to container;
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
                label: "<",
                onClick: ()=> {
                    this.scene.scene.stop(cfg.scenes.battleGrid);
                    this.scene.scene.start(cfg.scenes.navigation);
                }
            },
            {
                label: "x",
                onClick: ()=> {
                    console.log('x')
                }
            },
        ]
    }

}