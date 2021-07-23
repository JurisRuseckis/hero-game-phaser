import Phaser from "phaser";
import {cfg} from "../cfg";
import BattleUIInputController from "../controllers/BattleUIInputController";
import BattleLogWindow, {uiAlignment} from "../ui-components/BattleLogWindow";
import CharacterDetails from "../ui-components/CharacterDetails";
import DebugWindow from "../models/DebugWindow";

export class BattleUIScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.battleUI
        });
    }

    init(data)
    {
        this.data.set('battle', data.battle);
    }

    preload ()
    {
    }

    create ()
    {

        // const debugWindow = new DebugWindow({
        //     scene: this,
        // });

        const battle = this.data.get('battle');
        const battleLogWindow = new BattleLogWindow({
            scene: this,
            battleLog: battle.battleLog,
            alignment: uiAlignment.bottomLeft
        });
        const characterDetails = new CharacterDetails({
            scene: this,
            alignment: uiAlignment.bottomRight
        });
        const debugWindow = new DebugWindow({
            scene: this,
        });


        // this.data.set('debugWindow', debugWindow);
        this.data.set('battleLogWindow', battleLogWindow);
        this.data.set('characterDetails', characterDetails);
        this.data.set('debugWindow', debugWindow);

        const inputController = new BattleUIInputController({
            scene: this,
        });
        this.data.set('inputController', inputController);
    }

    update(time, delta){
        const battleLogWindow = this.data.get('battleLogWindow');
        const characterDetails = this.data.get('characterDetails');
        const debugWindow = this.data.get('debugWindow');

        const hoveredTile = this.registry.get('hoveredTile');
        const camScroll = this.registry.get('camScroll');

        battleLogWindow.update();
        characterDetails.update();
        debugWindow.displayJson({
            ...camScroll,
            ...hoveredTile
        });
        if(debugWindow.update) {
            debugWindow.redraw();
        }
    }
}