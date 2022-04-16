import Phaser from "phaser";
import {cfg} from "../cfg";
import BattleUIInputController from "../controllers/BattleUIInputController";
import BattleLogWindow from "../ui-components/BattleLogWindow";
import TileInfo from "../ui-components/TileInfo";
import DebugWindow from "../ui-components/DebugWindow";
import ResultWindow from "../ui-components/ResultWindow";
import {styles} from "../styles";
import {battleStatus} from "../models/Battle";
import QuickMenu from "../ui-components/QuickMenu";
import DeployConfirmation from "../ui-components/DeployConfirmation";

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
        this.data.set('gridUnits', data.gridUnits);
    }

    preload ()
    {
        // this.load.scenePlugin({
        //     key: 'rexuiplugin',
        //     plugin: UIPlugin,
        //     mapping: 'rexUI'
        // })
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
            battleLog: battle.battleLog
        });
        const tileInfo = new TileInfo({
            scene: this,
            alignment: styles.anchors.bottomRight
        });
        if(styles.isMobile){
            tileInfo.cont.setVisible(false);
        }
        const debugWindow = new DebugWindow({
            scene: this,
        });
        const resultWindow = new ResultWindow({
            scene: this
        });
        resultWindow.container.setVisible(false);
        const quickMenu = new QuickMenu({
            scene: this
        });
        const deployConfirmation = new DeployConfirmation({
            scene: this
        });


        // this.data.set('debugWindow', debugWindow);
        this.data.set('battleLogWindow', battleLogWindow);
        this.data.set('tileInfo', tileInfo);
        this.data.set('debugWindow', debugWindow);
        this.data.set('resultWindow', resultWindow);
        this.data.set('quickMenu', quickMenu);
        this.data.set('deployConfirmation', deployConfirmation);

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
        const deployConfirmation = this.data.get('deployConfirmation');
        const resultWindowTriggered = this.data.get('resultWindowTriggered');

        const selectedTile = this.registry.get('selectedTile');
        const battle = this.data.get('battle');

        const bStatus = battle ? battle.status : battleStatus.undefined;

        resultWindow.update();
        quickMenu.update();
        deployConfirmation.update();
        battleLogWindow.update();
        if(selectedTile && selectedTile.update){
            tileInfo.setTile(selectedTile);
            selectedTile.update = false;
            this.registry.set('selectedTile', selectedTile);
        }
        debugWindow.displayJson({
            'registry' : this.registry.getAll(),
        });
        if(debugWindow.update) {
            debugWindow.redraw();
        }
        if(bStatus === battleStatus.finished && !resultWindowTriggered){
            const resultWindow = this.data.get('resultWindow');
            const winner = battle.getWinnerTeam();
            if(winner === 1) {
                resultWindow.setText(`You won!`);
            } else {
                resultWindow.setText(`You Lost! Team ${winner} has won!`);
            }
            
            resultWindow.container.setVisible(true);
            this.data.set('resultWindowTriggered', true);
        }
    }
}