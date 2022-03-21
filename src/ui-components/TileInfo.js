import {styles} from "../styles";
import {uiAlignment} from "./BattleLogWindow";
import Btn from "./Btn";
import {tileLabel} from "../models/AI/BattleAI";

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

        this.width = styles.isMobile ? styles.grid.window : styles.viewPort.width * 0.33;
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

        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
        ]);

        this.tileCombatants = [];
        this.combatantAbilities = [];
        this.combatantTurns = [];

        this.createTileProps();
        this.createCombatantProps(bgBox);

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

    createCombatantProps(bgBox){
        const title = this.scene.add.text(this.margin, this.margin, 'combatant title', {
            fontSize: styles.fontSize.large
        }).setOrigin(0).setName('cmbTitle');

        const hp = this.scene.add.text(this.margin, title.getBottomCenter().y + this.margin, 'hp/max hp', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbHp');

        const speed = this.scene.add.text(this.margin, hp.getBottomCenter().y, 'speed', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbSpeed');

        const atk = this.scene.add.text(this.margin, speed.getBottomCenter().y, 'attack', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbAttack');

        const turnMeter = this.scene.add.text(this.margin, atk.getBottomCenter().y, 'turnMeter', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbTurnMeter');



        const btnSize = styles.viewPort.width * 0.02;
        const closeBtn = new Btn({
            scene: this.scene,
            x: bgBox.getBottomRight().x - (this.margin + btnSize),
            y: this.margin,
            width: btnSize,
            height: btnSize,
            text: 'x',
            textStyle: {fontSize: styles.fontSize.default}
        });
        closeBtn.addDefaultEvents();
        closeBtn.btnObj.on('pointerdown', () => {
            this.container.getByName('combatantPropContainer').setVisible(false);
            this.container.getByName('tilePropContainer').setVisible(true);
        }, this);

        this.container.add(this.scene.add.container(0, 0, [
            title,
            hp,
            speed,
            atk,
            turnMeter,
            closeBtn.container
        ]).setName('combatantPropContainer').setVisible(false));
    }

    createTileProps(){
        const title = this.scene.add.text(this.margin, this.margin, '', {
            fontSize: styles.fontSize.large
        }).setOrigin(0).setName('tileTitle');

        this.container.add(this.scene.add.container(0, 0, [
            title,
        ]).setName('tilePropContainer'));
    }

    setTile(tile){
        if(!tile){
            this.clearTileProps();
            return;
        }
        const tileContainer = this.container.getByName('tilePropContainer')
        tileContainer.getByName('tileTitle').setText(`${tileLabel[tile.tileIndex]} (${tile.tileX},${tile.tileY}) `);
        this.setTileProps(tile, tileContainer);
    }

    clearTileProps(){
        this.tileCombatants.forEach((x) => {
            x.destroy();
        })
        this.tileCombatants = [];
        this.container.getByName('combatantPropContainer').setVisible(false);
        this.container.getByName('tilePropContainer').setVisible(true);
    }

    setTileProps(tile, tileContainer){

        this.clearTileProps();
        const title = tileContainer.getByName('tileTitle');
        const bgBox = this.container.getByName('bgBox');

        let cmbList = [];
        if(tile.combatant){
            cmbList.push(tile.combatant);
        }

        if(tile.corpses){
            tile.corpses.forEach((corpse) => {
                cmbList.push(corpse);
            })
        }

        this.tileCombatants = cmbList.map((combatant, key) => {

            let label = `${combatant.label} [team ${combatant.team}]`;
            if(combatant.hp <= 0){
                label = `☠️${combatant.label} [team ${combatant.team}]`;
            }


            const btn = new Btn({
                key: 'tileCombatant',
                scene: this.scene,
                x: this.margin,
                y: title.height + this.margin * 2 + (styles.fontSize.large + this.margin) * key,
                width: bgBox.width - this.margin * 2,
                height: 36,
                text: label,
                textStyle: {fontSize: styles.fontSize.default}
            });

            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', () => {
                this.setCombatantProps(combatant);
                this.container.getByName('combatantPropContainer').setVisible(true);
                this.container.getByName('tilePropContainer').setVisible(false);
            }, this);

            tileContainer.add(btn.container)

            return btn;
        })
    }

    clearCombatantProps(){
        this.combatantAbilities.forEach((x) => {
            x.destroy();
        });
        this.combatantAbilities = [];
        this.combatantTurns.forEach((x) => {
            x.destroy();
        });
        this.combatantTurns = [];
    }

    /**
     *
     * @param combatant {Combatant}
     */
    setCombatantProps(combatant){
        this.clearCombatantProps();
        const tileContainer = this.container.getByName('combatantPropContainer');

        let label = `${combatant.label} [team ${combatant.team}]`;
        if(combatant.hp <= 0){
            label = `☠️${combatant.label} [team ${combatant.team}]`;
        }

        tileContainer.getByName('cmbTitle').setText(label);
        tileContainer.getByName('cmbHp').setText(`HP: ${combatant.hp}/${combatant.maxHp}`);
        tileContainer.getByName('cmbSpeed').setText(`Base Speed: ${combatant.character.baseSpeed}`);
        tileContainer.getByName('cmbAttack').setText(`Attack: [${combatant.character.atk[0]}-${combatant.character.atk[1]}]`);
        // last element in stats
        // mby should rename to lastElem or smth
        const turnMeterLabel = tileContainer.getByName('cmbTurnMeter');
        turnMeterLabel.setText(`TurnMeter: ${combatant.turnMeter}/1`);
        let line = turnMeterLabel.getBottomCenter().y;

        this.combatantAbilities = Object.entries(combatant.combatActions).map((combatAction, index)=>{
            const txt =this.scene.add.text(
                this.margin + (160 + this.margin)*index,
                line + this.margin,
                `${combatAction[0]}(${combatAction[1].cooldown})`,
                {
                    fontSize: styles.fontSize.default
                }).setOrigin(0)
                tileContainer.add(txt);
            return txt;
        });
        // here comes turns
        
    }

}