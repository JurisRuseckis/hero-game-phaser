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

        const slotsInRow = 6;
        // width - container padding - space between slots, divided by slots wanted
        const slotSize = (boxContainer.width - styles.padding * (1 + slotsInRow)) / slotsInRow;
        // prob will use in future to add scrollbar to see each lvl
        const rows = Math.floor((boxContainer.height - boxTitle.height - styles.padding * 2 - slotSize/2 ) / (slotSize+styles.padding));

        const startX = boxContainerBounds.left + styles.padding;
        const startY =  boxContainerBounds.top + boxTitle.height + styles.padding * 2;
        // as it is square...
        const step = slotSize + styles.padding;
        let row = 0;
        let column = 0;

        const buttons = menuItems.map((menuItem, index) => {
        
            const btn = new Btn({
                scene: this,
                x: startX + column * step,
                y: startY + row * step,
                width: slotSize,
                height: slotSize,
                text: index+1,
                textStyle: {fontSize: styles.fontSize.large},
                ornament: menuItem.completed ? "✓" : undefined
            });

            if(column+1 >= slotsInRow){
                column=0;
                row++;
            } else {
                column++;
            }

            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', menuItem.onClick);

            return btn;
        })

    }

    loadLevels () {
        return [
            {
                id: 0,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
            {
                id: 1,
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

                    this.startBattle(testBattle,1);
                }
            },
            {
                id: 2,
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
                    this.startBattle(testBattle,2);
                }
            },
            {
                id: 3,
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
                    this.startBattle(testBattle,3);
                }
            },
            {
                id: 4,
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
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
                            [0,1,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0],
                            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        ],
                        teams: [new BattleTeam({
                            formation: [
                                [characterRoster.elf.bowyer,characterRoster.elf.bowyer],
                                [characterRoster.elf.bowyer,characterRoster.elf.bowyer],
                                [characterRoster.elf.bowyer,characterRoster.elf.bowyer],
                                [characterRoster.elf.bowyer,characterRoster.elf.bowyer],
                            ],
                        }), new BattleTeam({
                            formation: [
                                [characterRoster.dwarf.miner,characterRoster.dwarf.miner],
                                [characterRoster.dwarf.miner,characterRoster.dwarf.miner],
                                [characterRoster.dwarf.miner,characterRoster.dwarf.miner],
                                [characterRoster.dwarf.miner,characterRoster.dwarf.miner],
                            ],
                        })]
                    })
                    this.startBattle(testBattle,4);
                }
            },
            {
                id: 5,
                label: "custom deployment",
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
                            singleUnits: [
                                {
                                    character: characterRoster.dwarf.commander,
                                    coordinates: new Phaser.Math.Vector2(1,1)
                                },
                                {
                                    character: characterRoster.dwarf.commander,
                                    coordinates: new Phaser.Math.Vector2(1,3)
                                },
                            ]
                        }), new BattleTeam({
                            singleUnits: [
                                {
                                    character: characterRoster.human.peasant,
                                    coordinates: new Phaser.Math.Vector2(3,1)
                                },
                                {
                                    character: characterRoster.human.peasant,
                                    coordinates: new Phaser.Math.Vector2(3,3)
                                },
                            ]
                        })]
                    })
                    this.startBattle(testBattle,5);
                }
            },
        ]
    }

    getMenuItems ()
    {
        const completedLevels = this.registry.get("completedLevels");
        const levels = this.loadLevels().map((level, index) => {
            level.completed = completedLevels.includes(level.id);
            return level;
        })
        return levels;
    }

    startBattle(testBattle, scenarioId){
        this.registry.set('scenarioId', scenarioId);
        this.registry.set('transition', {
            target: cfg.scenes.battleGrid,
            data: {
                battle: testBattle,
                scenarioId: scenarioId
            },
            changeLayout: true,
        });
    }
}