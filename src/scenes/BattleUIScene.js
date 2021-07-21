import Phaser from "phaser";
import {cfg} from "../cfg";
import BattleUIInputController from "../controllers/BattleUIInputController";
import BattleLogWindow, {uiAlignment} from "../ui-components/BattleLogWindow";
import CharacterDetails from "../ui-components/CharacterDetails";

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


        // this.data.set('debugWindow', debugWindow);
        this.data.set('battleLogWindow', battleLogWindow);
        this.data.set('characterDetails', characterDetails);

        const inputController = new BattleUIInputController({
            scene: this,
        });
        this.data.set('inputController', inputController);
    }

    update(time, delta){
        const battleLogWindow = this.data.get('battleLogWindow');
        const characterDetails = this.data.get('characterDetails');

        battleLogWindow.update();
        characterDetails.update();
    }
}