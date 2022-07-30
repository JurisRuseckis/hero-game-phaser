import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import CampSceneGrid from "../ui-components/CampSceneGrid";
import {warChest} from "../index";
import GameMaster from "../models/Generators/GameMaster";

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

    getMenuItems ()
    {
        const completedLevels = this.registry.get("completedLevels");
        return warChest.scenarios.tree.map((chapter)=>{
            chapter.items = chapter.items.map((scenario, index) => {
                scenario.completed = completedLevels.includes(`${scenario.chapter}.${scenario.indexChapterScenario}`);
                const battle = GameMaster.setupBattle(scenario);
                scenario.onClick = () => {
                    this.startBattle(battle,scenario.indexChapterScenario);
                }
                return scenario;
            });
            return chapter
        });
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