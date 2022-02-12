import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import BattleTeam from "../models/BattleTeam";
import Btn from "../ui-components/Btn";
import {characterRoster} from "../models/Generators/Characters";
import BattleGenerator from "../models/Generators/BattleGenerator";
import {battleAI} from "../models/AI/BattleAIs";

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
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle);
                }
            },
            {
                label: "Defensive Battle",
                onClick: ()=>{
                    const defensiveDwarf = {
                        ...characterRoster.dwarf.warrior
                    };
                    defensiveDwarf.battleAI = battleAI.defensive;
                    const testTeam = new BattleTeam({
                        formation: [
                            [defensiveDwarf,defensiveDwarf,defensiveDwarf,defensiveDwarf],
                            [defensiveDwarf,defensiveDwarf,defensiveDwarf,defensiveDwarf],
                            [defensiveDwarf,defensiveDwarf,defensiveDwarf,defensiveDwarf],
                            [defensiveDwarf,defensiveDwarf,defensiveDwarf,defensiveDwarf],
                        ],
                    });
                    const testBattle = BattleGenerator.generate({
                        // teamCount: 2,
                        // teamSize: 2,
                        teams: [testTeam]
                    })

                    this.startBattle(testBattle);
                }
            },
            {
                label: "1 on 1",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({
                        teamCount: 2,
                        // teamSize: 2,
                        arenaTiles: [
                            [0,0,0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,1,0],
                            [0,0,0,0,0,0,0,0,0,0,0],
                        ],
                        teams: [new BattleTeam({
                            formation: [
                                [characterRoster.elf.lord],
                            ],
                        }), new BattleTeam({
                            formation: [
                                [characterRoster.dwarf.commander],
                            ],
                        })]
                    })
                    this.startBattle(testBattle);
                }
            },
            {
                label: "1 on 1 labyrinth",
                onClick: ()=>{
                    const defensiveDwarf = {
                        ...characterRoster.dwarf.warrior
                    };
                    defensiveDwarf.battleAI = battleAI.defensive;
                    const testBattle = BattleGenerator.generate({
                        teamCount: 2,
                        // teamSize: 2,
                        arenaTiles: [
                            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,0,1,0,1,0,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,1,0],
                            [0,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        ],
                        teams: [new BattleTeam({
                            formation: [
                                [characterRoster.elf.lord],
                            ],
                        }), new BattleTeam({
                            formation: [
                                [characterRoster.elf.lord],
                                // [characterRoster.dwarf.warrior],
                            ],
                        })]
                    })
                    this.startBattle(testBattle);
                }
            },
            {
                label: "custom shit",
                onClick: ()=>{
                    const defensiveDwarf = {
                        ...characterRoster.dwarf.warrior
                    };
                    defensiveDwarf.battleAI = battleAI.defensive;
                    const testBattle = BattleGenerator.generate({
                        teamCount: 2,
                        // teamSize: 2,
                        arenaTiles: [
                            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,0,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        ],
                        teams: [new BattleTeam({
                            formation: [
                                [characterRoster.elf.lord],
                                [characterRoster.elf.lord],
                                [characterRoster.elf.lord],
                            ],
                        }), new BattleTeam({
                            formation: [
                                [characterRoster.dwarf.warrior],
                                [characterRoster.dwarf.warrior],
                                [characterRoster.dwarf.warrior],
                            ],
                        })]
                    })
                    this.startBattle(testBattle);
                }
            }
        ]
    }

    startBattle(testBattle){
        this.registry.set('transition', {
            target: cfg.scenes.battleGrid,
            data: {
                battle: testBattle,
            },
            changeLayout: true,
        });
    }
}