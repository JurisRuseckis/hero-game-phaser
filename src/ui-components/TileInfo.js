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
        this.createCombatantObjects(bgBox);

        // scroll factor fucks up pointerOver for childrem without scrollFactor 0
        this.container.setScrollFactor(0, 0, true);
        this.container.setDepth(1);
        console.log(this.container);
    }

    update() {
        // transform viewport coordinates to game coordinates.
        const targetCoordinates  = new Phaser.Math.Vector2(this.scene.scale.transformX(this.x), this.scene.scale.transformY(this.y));
        // console.log(targetCoordinates);
        // apply to container
        this.container.setPosition(targetCoordinates.x, targetCoordinates.y);
    }

    createCombatantObjects(bgBox){
        const title = this.scene.add.text(this.margin, this.margin, 'combatant title', {
            fontSize: styles.fontSize.large
        }).setOrigin(0).setName('cmbTitle');

        const hp = this.scene.add.text(this.margin, title.getBottomCenter().y, 'hp/max hp', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbHp');

        const turnMeter = this.scene.add.text(this.margin, hp.getBottomCenter().y, 'turnMeter', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbTurnMeter');

        const abilitiesTitle = this.scene.add.text(this.margin, turnMeter.getBottomCenter().y, 'ability (cooldown)', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbAbilitiesTitle');

        const turns = this.scene.add.text(this.margin, abilitiesTitle.getBottomCenter().y, 'turns where executor or target', {
            fontSize: styles.fontSize.default
        }).setOrigin(0).setName('cmbTurns');


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
            turnMeter,
            abilitiesTitle,
            turns,
            closeBtn.container
        ]).setName('combatantPropContainer').setVisible(false));
    }

    createTileObjects(){
        const title = this.scene.add.text(this.margin, this.margin, 'title (x,y)', {
            fontSize: styles.fontSize.large
        }).setOrigin(0).setName('tileTitle');

        const combatant = new Btn({
            key: 'tileCombatant',
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

        const corpses = new Btn({
            key: 'tileCorpse1',
            scene: this.scene,
            x: this.margin,
            y: this.margin * 3 + combatant.container.height + title.height,
            width: 300,
            height: 36,
            text: 'corpses1 label',
            textStyle: {fontSize: styles.fontSize.default}
        });

        corpses.addDefaultEvents();
        corpses.btnObj.on('pointerdown', () => {
            this.container.getByName('combatantPropContainer').setVisible(true);
            this.container.getByName('tilePropContainer').setVisible(false);
        }, this);

        this.tileCombatants = [
            combatant,
            corpses
        ];

        this.container.add(this.scene.add.container(0, 0, [
            title,
            combatant.container,
            corpses.container
        ]).setName('tilePropContainer'));
    }

    setTile(tile){
        if(!tile){
            this.clearcombatantBtns();
            return;
        }
        const tileContainer = this.container.getByName('tilePropContainer')
        const title = tileContainer.getByName('tileTitle').setText(`${tileLabel[tile.tileIndex]} (${tile.tileX},${tile.tileY}) `);
        this.setCombatantBtns(tile, tileContainer);
    }

    clearcombatantBtns(){
        this.tileCombatants.forEach((x) => {
            x.destroy();
        })
        this.tileCombatants = [];
    }

    setCombatantBtns(tile, tileContainer){

        this.clearcombatantBtns();
        const title = tileContainer.getByName('tileTitle');

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
            const btn = new Btn({
                key: 'tileCombatant',
                scene: this.scene,
                x: this.margin,
                y: title.height + this.margin * 2 + (40 + this.margin) * key,
                width: 300,
                height: 36,
                text: combatant.label,
                textStyle: {fontSize: styles.fontSize.default}
            });

            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', () => {
                this.container.getByName('combatantPropContainer').setVisible(true);
                this.container.getByName('tilePropContainer').setVisible(false);
            }, this);

            tileContainer.add(btn.container)

            return btn;
        })
    }

}