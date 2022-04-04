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

        this.width = styles.isMobile ? styles.grid.window : styles.viewPort.width * 0.33;
        this.height = styles.isMobile ? styles.grid.window * 0.2 : styles.viewPort.width * 0.2;

        if(this.alignment !== uiAlignment.bottomRight){
            throw "not implemented";
        }

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
            height: this.height - (3*styles.padding + styles.fontSize.large),

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

        return this.combatantList;
    }

    createCombatantListItem(combatant){
        const bg = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
            .setFillStyle(styles.colors.modernBtn, 1)
            .setStrokeStyle(1, styles.colors.modernBorder, 1)
            .setName('cmbListBtnBg');

        const unitSprite = this.scene.rexUI.add.roundRectangle(0, 0, 150, 150, 0, undefined)
            .setFillStyle(styles.colors.modernBg, .8)
            .setStrokeStyle(1, styles.colors.modernBorder, 1);

        const listItem = this.scene.rexUI.add.sizer({
            orientation: 'h',
            width: this.width * 0.8,
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
            .add(this.createCombatantStatBars(combatant), { expand: true, align: 'left' })
            .add(this.createCombatantAtt(`${combatant.character.atk[0]}-${combatant.character.atk[1]}`, combatant.combatActions.attack.range), { expand: true, align: 'left' });

        return listItem;
    }

    createCombatantStatBars(combatant){
        const label = this.scene.rexUI.add.label({
            orientation: 'x',
        });

        let labeltxt = `${combatant.label} [team ${combatant.team}]`;
        if(combatant.hp <= 0){
            labeltxt = `☠️${combatant.label} [team ${combatant.team}]`;
        }

        const title = this.scene.add.text(0, 0, labeltxt,{
            fontSize: styles.fontSize.large,
            color: styles.textColors.white
        });

        label.add(title, {expand: true});

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
            .add(this.createBar('Health', combatant.maxHp, combatant.hp), {expand: true, align: "left"})
            .add(this.createBar('Turnmeter', 1, combatant.turnMeter, styles.colors.white), {expand: true, align: "left"});

        return infoBox;
    }

    createBar(label, maxVal, val, barColor=styles.colors.red){
        const numberBar = this.scene.rexUI.add.numberBar({
            name: `tileinfo-${label}`,
            width: this.width * 0.4,
            height: 30,

            slider: {
                width: this.width * 0.2, // Fixed width
                track: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, styles.colors.modernBg),
                indicator: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, barColor),
            },

            text: this.scene.add.text(0, 0, '', {fontSize: styles.fontSize.default,}),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                slider: 10,
            },

            valuechangeCallback: function (value, oldValue, numberBar) {
                numberBar.text = `${Math.round(Phaser.Math.Linear(0, maxVal, value))}/${maxVal} ${label}`;
            },
        });
        numberBar.setValue(val, 0, maxVal);
        return numberBar;
    }

    createCombatantAtt(dmgInterval, range){
        const label = this.scene.rexUI.add.label({
            orientation: 'x',
        });

        const title = this.scene.add.text(0, 0, 'Attack',{
            fontSize: styles.fontSize.large,
            color: styles.textColors.white
        });

        label.add(title, {expand: true});

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
            .add(this.scene.rexUI.add.label({
                orientation: 'x',
                text: this.scene.add.text(0, 0, `Damage: ${dmgInterval}`,{
                    fontSize: styles.fontSize.default,
                    color: styles.textColors.white
                })
            }), {expand: true, align: "left"})
            .add(this.scene.rexUI.add.label({
                orientation: 'x',
                text: this.scene.add.text(0, 0, `Range: ${range}`,{
                    fontSize: styles.fontSize.default,
                    color: styles.textColors.white
                })
            }), {expand: true, align: "left"});

        return infoBox;
    }

    setTile(tile){
        // not checking if same tile, cause we are not refreshing automatically
        this.combatantList.removeAll(true);

        this.tileCombatants = [];
        if(!tile){
            return;
        }

        this.title.setText(`${tileLabel[tile.tileIndex]} (${tile.tileX},${tile.tileY})`);

        let cmbList = [];
        if(tile.combatant){
            cmbList.push(tile.combatant);
        }

        if(tile.corpses){
            tile.corpses.forEach((corpse) => {
                cmbList.push(corpse);
            })
        }

        this.tileCombatants = cmbList.map((combatant) => {
            this.combatantList.add(this.createCombatantListItem(combatant))
        });

        this.cont.layout();
    }

}