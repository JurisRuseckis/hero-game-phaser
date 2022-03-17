import {styles} from "../styles";
import {uiAlignment} from "./BattleLogWindow";
import Btn from "./Btn";
import {cfg} from "../cfg";

export default class DeployConfirmation {
    /**
     * 
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     * @param {number} props.alignment
     */
    constructor(props) {
        this.scene = props.scene;
        this.alignment = props.alignment;

        if(this.alignment !== uiAlignment.top){
            throw "not implemented";
        }

        const btnSize = styles.viewPort.width * 0.02;

        this.margin = styles.padding;
        this.height = btnSize + this.margin * 2;

        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,0,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');

        const txt = this.scene.add.text(this.margin, (this.height - styles.fontSize.default)/2, "Deployment stage", {fontSize: styles.fontSize.default});

        const txtBounds = txt.getBounds();
        const btn = new Btn({
            scene: this.scene,
            x: txtBounds.right + this.margin,
            y: this.margin,
            width: 300,
            height: btnSize,
            text: "Start Battle",
            textStyle: {fontSize: styles.fontSize.default}
        });

        btn.addDefaultEvents();
        btn.btnObj.on('pointerdown', () => {}, this);

        this.width = this.margin * 3 + btn.btnObj.width + txtBounds.width;
        bgBox.setSize(this.width, this.height);


        // if top
        this.x = this.scene.scale.displaySize.width / 2 - this.width / (this.scene.scale.displayScale.x * 2);
        // this.x = this.scene.scale.displaySize.width - (this.width + this.margin) / this.scene.scale.displayScale.x;
        this.y = this.margin / this.scene.scale.displayScale.y;
        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
            txt,
            btn.container
        ]);

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

}