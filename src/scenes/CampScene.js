import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import BattleTeam from "../models/BattleTeam";
import {characterRoster} from "../models/Generators/Characters";
import BattleGenerator from "../models/Generators/BattleGenerator";
import {battleAI} from "../models/AI/BattleAIs";
import CampSceneGrid from "../ui-components/CampSceneGrid";

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
        const campSceneGrid = new CampSceneGrid({
            scene: this,
            alignment: {
                centerX: 'center',
                top: `top+${styles.panelLayout.contentStart}`
            },
            levels: this.getMenuItems()
        });
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
            {
                id: 6,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
            {
                id: 7,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
            {
                id: 8,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
            {
                id: 9,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
            {
                id: 10,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
            {
                id: 11,
                label: "Random Battle",
                onClick: ()=>{
                    const testBattle = BattleGenerator.generate({})
                    this.startBattle(testBattle,0);
                }
            },
        ]
    }

    getMenuItems ()
    {
        const completedLevels = this.registry.get("completedLevels");
        const levels = {
            title: "test",
            items: this.loadLevels().map((level, index) => {
                level.completed = completedLevels.includes(level.id);
                return level;
            })
        }
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