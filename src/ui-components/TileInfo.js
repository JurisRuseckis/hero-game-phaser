import {styles} from "../styles";
import {uiAlignment} from "./BattleLogWindow";
import Btn from "./Btn";

export default class TileInfo
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


        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,this.width,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');

        //1st tile info
        //2nd combatant/corpse info

        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
        ]);

        this.createTileObjects();
        this.createCombatantObjects();


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

    setTile(tile){

    }

    createCombatantObjects(){
        const title = this.scene.add.text(this.margin, this.margin, 'combatant title', {
            fontSize: styles.fontSize.large
        }).setOrigin(0).setName('cmbTitle');

        const hp = this.scene.add.text(this.margin, title.getBottomCenter().y, 'hp/max hp', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbHp');

        const turnMeter = this.scene.add.text(this.margin, hp.getBottomCenter().y, 'turnMeter', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbTurnMeter');

        const abilities = this.scene.add.text(this.margin, turnMeter.getBottomCenter().y, 'ability (cooldown)', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbAbilities');

        const turns = this.scene.add.text(this.margin, abilities.getBottomCenter().y, 'turns where executor or target', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbTurns');

        this.container.add(this.scene.add.container(0, 0, [
            title,
            hp,
            turnMeter,
            abilities,
            turns,
        ]).setName('combatantPropContainer').setVisible(false));
    }

    createTileObjects(){
        const title = this.scene.add.text(this.margin, this.margin, 'title (x,y)', {
            fontSize: styles.fontSize.large
        }).setOrigin(0);

        const combatant = new Btn({
            scene: this.scene,
            x: this.margin,
            y: this.margin + title.getBottomCenter().y,
            width: 300,
            height: 36,
            text: 'combatant label',
            textStyle: {fontSize: styles.fontSize.default}
        });

        combatant.addDefaultEvents();
        combatant.btnObj.on('pointerdown', () => {
            this.container.getByName('combatantPropContainer').setVisible(true);
            this.container.getByName('tilePropContainer').setVisible(false);
        }, this);

        this.container.add(this.scene.add.container(0, 0, [
            title,
            combatant.container
        ]).setName('tilePropContainer'));
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
}