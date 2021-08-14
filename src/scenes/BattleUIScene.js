import Phaser from "phaser";
import {cfg} from "../cfg";
import BattleUIInputController from "../controllers/BattleUIInputController";
import BattleLogWindow, {uiAlignment} from "../ui-components/BattleLogWindow";
import TileInfo from "../ui-components/TileInfo";
import DebugWindow from "../ui-components/DebugWindow";
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
        const tileInfo = new TileInfo({
            scene: this,
            alignment: uiAlignment.bottomRight
        });
        if(styles.isMobile){
            tileInfo.container.setVisible(false);
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
        this.data.set('tileInfo', tileInfo);
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
        const tileInfo = this.data.get('tileInfo');
        const debugWindow = this.data.get('debugWindow');
        const resultWindow = this.data.get('resultWindow');
        const quickMenu = this.data.get('quickMenu');
        const resultWindowTriggered = this.data.get('resultWindowTriggered');

        const selectedTile = this.registry.get('selectedTile');
        const bStatus = this.registry.get('battleStatus');

        resultWindow.update();
        quickMenu.update();
        battleLogWindow.update();
        tileInfo.update();
        tileInfo.setTile(selectedTile);
        debugWindow.displayJson({
            'registry' : this.registry.getAll(),
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