import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import tileSetImage from "../assets/tileset.png";
import Debugger from "../models/Debugger";
import BattleInputController from "../controllers/BattleInputController";
import BattleGenerator from "../models/Generators/BattleGenerator";
import GridUnit, { statusOption } from "../ui-components/GridUnit";
import Battle, { battleStatus } from "../models/Battle";
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
        this.unitStartPos = (this.tileSize - this.unitSize)/2;
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

        this.tilemap = this.make.tilemap({ tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileSet = this.tilemap.addTilesetImage('battleTileset', null, this.tileSize, this.tileSize, 0, 0);
        const tileGridLayer = this.tilemap.createBlankLayer('battleGridLayer', tileSet, 0, 0, battle.arena.width, battle.arena.height);
        this.tilemap.putTilesAt(battle.arena.tiles, 0, 0, true, tileGridLayer);

        this.debugger = new Debugger({
            scene: this,
        });
        
        this.marker = this.createTileSelector();

        this.combatantStatuses = Object.values(battle.getCombatants(false)).map((combatant)=>{
            const gridUnit = new GridUnit({
                scene: this,
                tileCoords:combatant.coordinates,
                tileSize: this.tileSize,
                unitSize: this.unitSize,
                text: combatant.hp,
                cmbId: combatant.id
            });
            gridUnit.addDefaultEvents();

            return gridUnit;
        }).flat();

        this.battleLogDebugger = new Debugger({
            scene: this,
            y: this.scale.height - (16 + 18)
        });

        this.InputController = new BattleInputController({
            scene: this,
        });

    }

    update(time, delta){
        this.turnTimer += delta;
        // as sometimes we can lag a bit we do a loop 
        while (this.turnTimer > this.turndelay) {
            const battle = this.data.get('battle');
            const turnResults = battle.nextTurn();
            // if battle in progress then update scene
            if(battle.status !== battleStatus.finished){
                this.updateBattleScene(battle, turnResults.executor, turnResults.action);
                this.battleLogDebugger.setText(battle.battleLog.getLastOfType(battleLogType.turn).text);
            }
            this.turnTimer -= this.turndelay;
        }

        this.InputController.checkBtns();
        if(this.debugger.update){
            this.debugger.redraw();
        }

        if(this.battleLogDebugger.update){
            this.battleLogDebugger.redraw();
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
          if(this.target){
              this.combatantStatuses.find(c => c.cmbId === this.target.id).setStyle(statusOption.default);
          }
          if(this.executorId){
              this.combatantStatuses.find(c => c.cmbId === this.executorId).setStyle(statusOption.default);
          }
  
          this.target = action.target ? action.target : null;
          this.executorId = executor.id;
  
          if(this.target){
              const targetObj = this.combatantStatuses.find(c => c.cmbId === this.target.id)
              targetObj.setStyle(statusOption.target);
              targetObj.txtObj.setText(this.target.hp);
              if(this.target.hp <= 0){
                  targetObj.crossObj.setVisible(true);
              }
          }
  
          this.combatantStatuses.find(c => c.cmbId === this.executorId).setStyle(statusOption.executor);
          
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

      createTileSelector() {
        //  Our painting marker
        let marker = this.add.graphics();
        marker.lineStyle(2, 0xffffff, 1.0);
        marker.strokeRect(0, 0, this.tileSize, this.tileSize);
        return marker;
    }
    
}