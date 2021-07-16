import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import BattleTeam from "../models/BattleTeam";
import Btn from "../ui-components/Btn";
import {characterRoster} from "../models/Generators/Characters";
import BattleGenerator from "../models/Generators/BattleGenerator";

export class CampScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.camp
        });
    }

    preload ()
    {
        const testTeam = new BattleTeam({
            formation: [
                [characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior],
                [characterRoster.dwarf.commander,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior],
                [characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior],
                [characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior,characterRoster.dwarf.warrior],
            ],
        });
        console.table(testTeam.printFormation());
        const testBattle = BattleGenerator.generate({
            teams: [testTeam]
        })

        this.data.set('battle', testBattle);
        // let angles = [
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.RIGHT.angle() - Phaser.Math.Vector2.RIGHT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.RIGHT.angle() - Phaser.Math.Vector2.LEFT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.RIGHT.angle() - Phaser.Math.Vector2.UP.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.RIGHT.angle() - Phaser.Math.Vector2.DOWN.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.LEFT.angle() - Phaser.Math.Vector2.RIGHT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.LEFT.angle() - Phaser.Math.Vector2.LEFT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.LEFT.angle() - Phaser.Math.Vector2.UP.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.LEFT.angle() - Phaser.Math.Vector2.DOWN.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.UP.angle() - Phaser.Math.Vector2.RIGHT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.UP.angle() - Phaser.Math.Vector2.LEFT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.UP.angle() - Phaser.Math.Vector2.UP.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.UP.angle() - Phaser.Math.Vector2.DOWN.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.DOWN.angle() - Phaser.Math.Vector2.RIGHT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.DOWN.angle() - Phaser.Math.Vector2.LEFT.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.DOWN.angle() - Phaser.Math.Vector2.UP.angle()),
        //     Phaser.Math.RadToDeg(Phaser.Math.Vector2.DOWN.angle() - Phaser.Math.Vector2.DOWN.angle()),
        // ];
    }

    create ()
    {
        // will need to load save here
        const menuItems = this.getMenuItems();
        // precalculate to get box height by aspect ratio
        const btnWidth = styles.grid.window - styles.padding*2;
        const menuItemHeight = btnWidth * 0.15;

        const boxContainer = this.add.rectangle(
            styles.viewPort.centerX,
            styles.panelLayout.contentStart,
            styles.grid.window,
            styles.panelLayout.contentHeight,
            styles.colors.modernBg
        ).setOrigin(0.5,0);
        boxContainer.setStrokeStyle(styles.borderWidth, styles.colors.modernBorder);

        const boxContainerBounds = boxContainer.getBounds();
        const boxTitle = this.add.text(
            boxContainer.x,
            boxContainerBounds.top + styles.padding,
            "Camp",
            {fontSize: styles.fontSize.title}
        ).setOrigin(0.5,0);

        const buttons = menuItems.map((menuItem, index) => {
            const btn = new Btn({
                scene: this,
                x: boxContainer.x - btnWidth/2,
                y: boxContainerBounds.top + boxTitle.height + styles.padding * 2 + index * (menuItemHeight + styles.padding),
                width: btnWidth,
                height: menuItemHeight,
                text: menuItem.label,
                textStyle: {fontSize: styles.fontSize.default}
            })
            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', menuItem.onClick);
            return btn;
        })

    }

    getMenuItems ()
    {
        return [
            {
                label: "Start Battle",
                onClick: ()=>{
                    // this.scene.start(cfg.scenes.navigation);
                    this.scene.start(cfg.scenes.loading, {
                        sceneKey: cfg.scenes.battleGrid,
                        battle: this.data.get('battle'),
                    });
                    this.registry.set('test', 'register is alive');
                }
            },
        ]
    }
}