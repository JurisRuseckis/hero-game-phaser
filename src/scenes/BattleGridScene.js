import Phaser from "phaser";
import {cfg} from "../cfg";
import tileSetImage from "../assets/tileset.png";
import DebugWindow from "../models/DebugWindow";
import BattleInputController from "../controllers/BattleInputController";
import BattleGenerator from "../models/Generators/BattleGenerator";
import GridUnit, { statusOption } from "../ui-components/GridUnit";
import { battleStatus } from "../models/Battle";
import {battleLogType} from "../models/BattleLog";

export class BattleGridScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.battleGrid
        });

        this.turndelay = 100;
        this.turnTimer = 0;
        this.turnCount = 0;

        this.tileSize = 48;
        this.unitSize = 32;
    }

    preload ()
    {
        this.load.image('battleTileset', tileSetImage);
        const battle = BattleGenerator.generate();
        this.data.set('battle', battle);
    }

    create ()
    {
        const battle = this.data.get('battle');

        const tilemap = this.make.tilemap({ tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileSet = tilemap.addTilesetImage('battleTileset', null, this.tileSize, this.tileSize, 0, 0);
        const tileGridLayer = tilemap.createBlankLayer('battleGridLayer', tileSet, 0, 0, battle.arena.width, battle.arena.height);
        tilemap.putTilesAt(battle.arena.tiles, 0, 0, true, tileGridLayer);
        battle.arena.tilemap = tilemap;

        this.data.set('tilemap', tilemap);

        const debugWindow = new DebugWindow({
            scene: this,
        });
        
        const marker = this.createTileSelector();

        const gridUnits = this.drawCombatants(Object.values(battle.getCombatants(false)));

        const battleLogDebugWindow = new DebugWindow({
            scene: this,
            y: this.scale.height - (16 + 18)
        });

        const inputController = new BattleInputController({
            scene: this,
        });


        this.data.set('debugWindow', debugWindow);
        this.data.set('marker', marker);
        this.data.set('gridUnits', gridUnits);
        this.data.set('battleLogDebugWindow', battleLogDebugWindow);
        this.data.set('inputController', inputController);
    }

    update(time, delta){
        const battleLogDebugWindow = this.data.get('battleLogDebugWindow');
        const debugWindow = this.data.get('debugWindow');
        const inputController = this.data.get('inputController');

        this.turnTimer += delta;
        // as sometimes we can lag a bit we do a loop 
        while (this.turnTimer > this.turndelay /*&& this.turnCount < 100*/) {
            this.turnCount++;
            const battle = this.data.get('battle');
            const turnResults = battle.nextTurn();
            // if battle in progress then update scene
            if(battle.status !== battleStatus.finished){
                this.updateBattleScene(battle, turnResults.executor, turnResults.action);
                battleLogDebugWindow.setText(battle.battleLog.getLastOfType(battleLogType.turn).text);
            }
            this.turnTimer -= this.turndelay;
        }

        inputController.checkBtns();
        if(debugWindow.update){
            debugWindow.redraw();
        }

        if(battleLogDebugWindow.update){
            battleLogDebugWindow.redraw();
        }
    }

     /**
     * i need turn update not per time
     * @param {Battle} battle
     * @param {Combatant} executor
     * @param {CombatAction} action
     */
    updateBattleScene(battle, executor, action)
    {
        const gridUnits = this.data.get('gridUnits');
        if(this.target && this.target.combatant){
            gridUnits.find(c => c.cmbId === this.target.combatant.id).setStyle(statusOption.default);
        }
        if(this.executorId){
            gridUnits.find(c => c.cmbId === this.executorId).setStyle(statusOption.default);
        }

        this.target = action.target ? action.target : null;
        this.executorId = executor.id;

        if(this.target && this.target.combatant){
            const targetObj = gridUnits.find(c => c.cmbId === this.target.combatant.id)
            targetObj.setStyle(statusOption.target);
            targetObj.txtObj.setText(this.target.combatant.hp);
            if(this.target.combatant.hp <= 0){
                targetObj.crossObj.setVisible(true);
                const tile = battle.arena.tilemap.getTileAt(this.target.combatant.coordinates.x,this.target.combatant.coordinates.y);
                tile.properties['cmbId'] = null;
            }
        }


        const gridUnit =gridUnits.find(c => c.cmbId === this.executorId);
        gridUnit.setStyle(statusOption.executor);
        if(action.key === 'walk'){
            gridUnit.moveToCoords(executor.coordinates);
        }

    }
 
     /**
      * @param props
      */
     showResults(props)
     {
         console.log('result window');
     }
 
     /**
      * @param {CombatAction[]} actions
      */
      updateActionBtns(actions)
      {
         
      }

      drawCombatants(combatants) {
        const tilemap = this.data.get('tilemap');

        return combatants.map((combatant)=>{
            const gridUnit = new GridUnit({
                scene: this,
                tileCoordinates: combatant.coordinates,
                tileSize: this.tileSize,
                unitSize: this.unitSize,
                text: combatant.hp,
                cmbId: combatant.id,
                direction: combatant.direction
            });
            gridUnit.addDefaultEvents();
            const tile = tilemap.getTileAt(combatant.coordinates.x, combatant.coordinates.y);
            tile.properties['cmbId'] = combatant.id;

            return gridUnit;
        }).flat();
      }

      createTileSelector() {
        //  Our painting marker
        let marker = this.add.graphics();
        marker.lineStyle(2, 0xffffff, 1.0);
        marker.strokeRect(0, 0, this.tileSize, this.tileSize);
        return marker;
    }
    
}