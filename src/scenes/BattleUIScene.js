import Phaser from "phaser";
import {cfg} from "../cfg";
import BattleUIInputController from "../controllers/BattleUIInputController";
import BattleLogWindow, {uiAlignment} from "../ui-components/BattleLogWindow";
import CharacterDetails from "../ui-components/CharacterDetails";
import DebugWindow from "../models/DebugWindow";
import ResultWindow from "../ui-components/ResultWindow";
import {styles} from "../styles";
import {battleStatus} from "../models/Battle";
import QuickMenu from "../ui-components/QuickMenu";

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
        this.data.set('resultWindowTriggered', false);
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
        if(styles.isMobile){
            characterDetails.container.setVisible(false);
        }
        const debugWindow = new DebugWindow({
            scene: this,
        });
        const resultWindow = new ResultWindow({
            scene: this,
            alignment: uiAlignment.middle
        });
        resultWindow.container.setVisible(false);
        const quickMenu = new QuickMenu({
            scene: this,
            alignment: uiAlignment.topRight
        });


        // this.data.set('debugWindow', debugWindow);
        this.data.set('battleLogWindow', battleLogWindow);
        this.data.set('characterDetails', characterDetails);
        this.data.set('debugWindow', debugWindow);
        this.data.set('resultWindow', resultWindow);
        this.data.set('quickMenu', quickMenu);

        const inputController = new BattleUIInputController({
            scene: this,
        });
        this.data.set('inputController', inputController);
    }

    update(time, delta){
        const battleLogWindow = this.data.get('battleLogWindow');
        const characterDetails = this.data.get('characterDetails');
        const debugWindow = this.data.get('debugWindow');
        const resultWindow = this.data.get('resultWindow');
        const quickMenu = this.data.get('quickMenu');
        const resultWindowTriggered = this.data.get('resultWindowTriggered');

        const hoveredTile = this.registry.get('hoveredTile');
        const camScroll = this.registry.get('camScroll');
        const bStatus = this.registry.get('battleStatus');

        resultWindow.update();
        quickMenu.update();
        battleLogWindow.update();
        characterDetails.update();
        characterDetails.setText(JSON.stringify(hoveredTile, null, '\t'));
        debugWindow.displayJson({
            ...camScroll,
            ...hoveredTile
        });
        if(debugWindow.update) {
            debugWindow.redraw();
        }
        if(bStatus === battleStatus.finished && !resultWindowTriggered){
            const resultWindow = this.data.get('resultWindow');
            resultWindow.setText("someone Won!");
            resultWindow.container.setVisible(true);
            this.data.set('resultWindowTriggered', true);
        }
    }
}