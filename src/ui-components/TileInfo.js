import {styles} from "../styles";
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

        this.width = styles.isMobile ? styles.grid.window : (styles.viewPort.width - 2 * styles.padding) * 0.333;
        this.height = styles.isMobile ? styles.grid.window * 0.2 : styles.viewPort.width * 0.2;

        this.cont = this.createWindow(props.alignment);
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

    createWindow(anchor) {
        const bg = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
            .setFillStyle(styles.colors.modernBg, .8)
            .setStrokeStyle(1, styles.colors.modernBorder, 1);

        const label = this.scene.rexUI.add.label({
            orientation: 'x',
        });

        this.title = this.scene.add.text(0, 0, '',{
            fontSize: styles.fontSize.large,
            color: styles.textColors.white
        });

        label.add(this.title, {expand: true});

        return this.scene.rexUI.add.sizer({
            anchor: anchor,
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

        const scrollPanel = this.scene.rexUI.add.scrollablePanel({
            name: 'scrollPanel',
            x: 0,
            y: 0,
            width: this.width - 2*styles.padding,
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
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                panel: styles.padding,
            }
        });

        return scrollPanel;
    }

    createCombatantList(){
        this.listItemWidth = this.width - 20 - styles.padding * 3;

        this.combatantList = this.scene.rexUI.add.sizer({
            width: this.listItemWidth,
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

        let labeltxt = combatant.hp <= 0 
            ? `☠️${combatant.label} [team ${combatant.team}]`
            :`${combatant.label} [team ${combatant.team}]`;
        
        const label = this.scene.rexUI.add.label({
            orientation: 'x',
            name: `combatant-${combatant.id}`
        })
            .add(this.scene.add.text(0, 0, labeltxt,{
                fontSize: styles.fontSize.large,
                color: styles.textColors.white
            }), { expand: true, align: 'left' });


        const content = this.scene.rexUI.add.sizer({
            orientation: 'h',
            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                item: styles.padding,
            }
        })
            .add(unitSprite, { expand: true, align: 'left' })
            .add(this.createCombatantStatBars(combatant), { expand: true, align: 'left' })
            .add(this.createCombatantAtt(`${combatant.character.atk[0]}-${combatant.character.atk[1]}`, combatant.combatActions.attack.range), { expand: true, align: 'right' });

        const listItem = this.scene.rexUI.add.sizer({
            width: this.listItemWidth,
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
            .add(label, { expand: true, align: 'top'})
            .add(content, { expand: true, align: 'top' })
            
        return listItem;
    }

    createCombatantStatBars(combatant){
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
            .addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
                .setFillStyle(styles.colors.modernBg, .8)
                .setStrokeStyle(1, styles.colors.modernBorder, 1))
            .add(this.createBar('HP', combatant.maxHp, combatant.hp), {expand: false, align: "left"})
            .add(this.createBar('TM', 1, combatant.turnMeter, styles.colors.white), {expand: false, align: "left"});

        return infoBox;
    }

    createBar(label, maxVal, val, barColor=styles.colors.red){
        // const numberBar = this.scene.rexUI.add.numberBar({
        //     name: `tileinfo-${label}`,

        //     slider: {
        //         width: this.width * 0.2, // Fixed width
        //         track: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, styles.colors.modernBg),
        //         indicator: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, barColor),
        //         input: 'none'
        //     },

        //     space: {
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         bottom: 0,
        //         slider: styles.padding,
        //     },
        // });
        // numberBar.setValue(val, 0, maxVal);
        const numberBar = this.scene.add.text(0,0,`${Math.round((val + Number.EPSILON) * 100) /100}/${maxVal} ${label}`, {fontSize: styles.fontSize.default});
        return numberBar;
    }

    createCombatantAtt(dmgInterval, range){
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
            .addBackground(this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
                .setFillStyle(styles.colors.modernBg, .8)
                .setStrokeStyle(1, styles.colors.modernBorder, 1))
            .add(this.scene.rexUI.add.label({
                    orientation: 'x',
                })
                    .add(this.scene.add.text(0, 0, 'Attack',{
                        fontSize: styles.fontSize.large,
                        color: styles.textColors.white
                    }), {expand: true}), 
                {expand: false, align: "left"}) 
            .add(this.scene.rexUI.add.label({
                orientation: 'x',
                text: this.scene.add.text(0, 0, `Damage: ${dmgInterval}`,{
                    fontSize: styles.fontSize.default,
                    color: styles.textColors.white
                })
            }), {expand: false, align: "left"})
            .add(this.scene.rexUI.add.label({
                orientation: 'x',
                text: this.scene.add.text(0, 0, `Range: ${range}`,{
                    fontSize: styles.fontSize.default,
                    color: styles.textColors.white
                })
            }), {expand: false, align: "left"});

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