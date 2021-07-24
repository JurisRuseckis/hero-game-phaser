import {styles} from "../styles";
import {uiAlignment} from "./BattleLogWindow";

export default class CharacterDetails
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

        // this.width = this.scene.scale.width / 3;
        // this.height = this.width * 1.2;

        this.width = styles.isMobile ? styles.grid.window : styles.viewPort.width * 0.3;
        this.height = styles.isMobile ? styles.grid.window * 0.2 : styles.viewPort.width * 0.2;
        this.margin = styles.padding;

        if(this.alignment !== uiAlignment.bottomRight){
            throw "not implemented";
        }

        // if bottom right
        this.x = this.scene.scale.displaySize.width - (this.width + this.margin) / this.scene.scale.displayScale.x;
        this.y = this.scene.scale.displaySize.height - (this.height + this.margin) / this.scene.scale.displayScale.y;
        console.log(this.scene.scale.displaySize);


        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,this.width,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');

        const txt = this.scene.add.text(0, 0,'test').setName('text');

        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
            txt
        ]);


        // scroll factor fucks up pointerOver for childrem without scrollFactor 0
        this.container.setScrollFactor(0, 0, true);
        this.container.setDepth(1);
    }

    update() {
        // transform viewport coordinates to game coordinates.
        const targetCoordinates  = new Phaser.Math.Vector2(this.scene.scale.transformX(this.x), this.scene.scale.transformY(this.y));
        // console.log(targetCoordinates);
        // apply to container
        this.container.setPosition(targetCoordinates.x, targetCoordinates.y);
    }

    setText(text){
        /**
         *
         * @type {Phaser.GameObjects.Text}
         */
        const txt = this.container.getByName('text');
        txt.setText(text);
    }
}