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

        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,this.width,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');

        this.cont = this.createWindow();
        this.cont.layout();


        this.cont.getByName('scrollPanel').setChildrenInteractive({
            targets: [
                this.cont.getByName('combatantList', true)
            ]
        })
            .on('child.over', function (child) {
                child.getByName('cmbListBtnBg').setFillStyle(styles.colors.modernBorder)
            })
            .on('child.out', function (child) {
                child.getByName('cmbListBtnBg').setFillStyle(styles.colors.modernBtn)
            })

        // main container
        this.container = this.scene.add.container(0,0, [
            bgBox,
        ]);
        this.container.setVisible(false);

        this.tileCombatants = [];
        this.combatantAbilities = [];
        this.combatantTurns = [];

        this.createTileProps();
        this.createCombatantProps(bgBox);

        // scroll factor fucks up pointerOver for childrem without scrollFactor 0
        this.container.setScrollFactor(0, 0, true);
        this.container.setDepth(1);
    }

    createWindow() {
        const bg = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
            .setFillStyle(styles.colors.modernBg, .8)
            .setStrokeStyle(1, styles.colors.modernBorder, 1);

        const label = this.scene.rexUI.add.label({
            orientation: 'x',
        });

        this.title = this.scene.add.text(0, 0, 'Tile',{
            fontSize: styles.fontSize.large,
            color: styles.textColors.white
        });

        label.add(this.title, {expand: true});

        return this.scene.rexUI.add.sizer({
            anchor: {
                right: `right-${styles.padding}`,
                bottom: `bottom-${styles.padding}`
            },
            width: this.width,
            height: this.height,
            orientation: 'v',
            space: {
                left: styles.padding,
                right: styles.padding,
                top: styles.padding,
                bottom: styles.padding,
                item: styles.padding,
            }
        })
            .addBackground(bg)
            .add(label, { expand: true, align: 'left' })
            .add(this.createScrollablePanel(), { expand: true, align: 'left' })
            .setName('tileInfo')
    }

    createScrollablePanel(){
        return this.scene.rexUI.add.scrollablePanel({
            name: 'scrollPanel',
            x: 0,
            y: 0,
            width: 600,
            height: 440,

            scrollMode: 'v',

            panel: {
                child:  this.createCombatantList(),

                mask: {
                    padding: 1,
                },
            },

            slider: {
                track: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, styles.colors.modernBorder),
                thumb: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, styles.colors.modernBtn),
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            space: {
                left: styles.padding,
                right: styles.padding,
                top: styles.padding,
                bottom: styles.padding,
                panel: styles.padding,
            }
        })
    }

    createCombatantList(){
        this.combatantList = this.scene.rexUI.add.sizer({
            orientation: 'v',
            space: {item: styles.padding},
            name: 'combatantList'
        })
            .add(this.createCombatantListItem(), {expand: true});

        return this.combatantList;
    }

    createCombatantListItem(){
        const bg = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
            .setFillStyle(styles.colors.modernBtn, 1)
            .setStrokeStyle(1, styles.colors.modernBorder, 1)
            .setName('cmbListBtnBg');

        const unitSprite = this.scene.rexUI.add.roundRectangle(0, 0, 150, 150, 0, undefined)
            .setFillStyle(styles.colors.modernBg, .8)
            .setStrokeStyle(1, styles.colors.modernBorder, 1);

        const listItem = this.scene.rexUI.add.sizer({
            orientation: 'h',
            space: {
                left: styles.padding,
                right: styles.padding,
                top: styles.padding,
                bottom: styles.padding,
                item: styles.padding,
            }
        })
            .addBackground(bg)
            .add(unitSprite, { expand: true, align: 'left' })
            .add(this.createCombatantShortInfoBox(), { expand: true, align: 'left' })

        return listItem;
    }

    createCombatantShortInfoBox(){
        const label = this.scene.rexUI.add.label({
            orientation: 'x',
        });

        this.title = this.scene.add.text(0, 0, 'Tile',{
            fontSize: styles.fontSize.large,
            color: styles.textColors.white
        });

        label.add(this.title, {expand: true});

        const infoBox = this.scene.rexUI.add.sizer({
            orientation: 'v',
            space: {
                left: styles.padding,
                right: styles.padding,
                top: styles.padding,
                bottom: styles.padding,
                item: styles.padding,
            }
        })
            .add(label, {expand: true, align: "left"})
            .add(this.createHealthBar(), {expand: true, align: "left"});

        return infoBox;
    }

    createHealthBar(){
        const numberBar = this.scene.rexUI.add.numberBar({

            width: this.width * 0.6,
            height: 30,

            slider: {
                // width: 120, // Fixed width
                track: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, styles.colors.modernBg),
                indicator: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, styles.colors.green),
            },

            text: this.scene.add.text(0, 0, ''),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                slider: 10,
            },

            valuechangeCallback: function (value, oldValue, numberBar) {
                console.log(value, oldValue);
                numberBar.text = `${Math.round(Phaser.Math.Linear(0, 125, value))}/${Math.round(Phaser.Math.Linear(125, 125, value))}`;
            },
        })
        numberBar.setValue(75, 0, 125);
        return numberBar;
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
        this.container.add(this.scene.add.container(0, 0).setName('tilePropContainer'));
    }

    setTile(tile){
        // not checking if same tile, cause we are not refreshing autmatically
        this.combatantList.removeAll(true);
        if(!tile){
            this.clearTileProps();
            return;
        }
        const tileContainer = this.container.getByName('tilePropContainer')
        this.title.setText(`${tileLabel[tile.tileIndex]} (${tile.tileX},${tile.tileY})`);
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