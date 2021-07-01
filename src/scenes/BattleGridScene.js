import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import tileSetImage from "../assets/tileset.png";
import Debugger from "../models/Debugger";
import BattleCameraController from "../controllers/BattleCameraController";
import BattleGenerator from "../models/Generators/BattleGenerator";
import CombatantStatus, { statusOption } from "../ui-components/CombatantStatus";
import Battle, { battleStatus } from "../models/Battle";
import BattleLog, {battleLogType} from "../models/BattleLog";

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
        const grid = [];
        for(let i = 0; i < 100; i++){
            let row = [];
            for(let j = 0; j< 100; j++){
                if(i===0||j===0||i===99||j===99){
                    row.push(0);
                } else {
                    row.push(1);
                }
            }
            grid.push(row);
        }

        this.map = this.make.tilemap({ tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileSet = this.map.addTilesetImage('battleTileset', null, this.tileSize, this.tileSize, 0, 0);
        const tileGridLayer = this.map.createBlankLayer('tileGridLayer', tileSet, 0, 0, this.tileSize * grid[0].length, grid.length);
        this.map.putTilesAt(grid, 0, 0, true, tileGridLayer);

        this.debugger = new Debugger({
            scene: this,
        });
        
        this.cameraController = new BattleCameraController({
            scene: this,
        });

        const battle = this.data.get('battle');
        const startPos = {
            x: 1,
            y: 1,
        }

        this.combatantStatuses = Object.values(battle.getCombatants(true)).map((team, teamIndex)=>{
            return team.map((combatant, combatantIndex) =>{
                return new CombatantStatus({
                    scene: this,
                    x: (startPos.x + combatantIndex) * this.tileSize + this.unitStartPos,
                    y: (startPos.y + teamIndex) * this.tileSize + this.unitStartPos,
                    radius: this.unitSize/2,
                    text: combatant.hp,
                    cmbId: combatant.id
                })
            });
        }).flat();

        this.battleLogDebugger = new Debugger({
            scene: this,
            y: this.scale.height - (16 + 18)
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

        this.cameraController.checkBtns();
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
}