import Phaser from "phaser";
import {cfg} from "../cfg";
import tileSetImage from "../assets/tileset.png";
import BattleInputController from "../controllers/BattleInputController";
import BattleGenerator from "../models/Generators/BattleGenerator";
import GridUnit, { statusOption } from "../battle-grid-components/GridUnit";
import { battleStatus } from "../models/Battle";

const markerType = {
    'hover' : {
        'key' : 'hover',
        'color' : 0xffffff
    },
    'select' : {
        'key' : 'select',
        'color' : 0xff0000
    },
}

export class BattleGridScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.battleGrid
        });

        this.turndelay = 10;
        this.turnTimer = 0;
        this.turnCount = 0;

        this.tileSize = 48;
        this.unitSize = 32;

        this.shownTurnCount = 25;
        this.shownTurns = []
    }

    init(data){
        if(this.turnCount > 0 ){
            this.turnTimer = 0;
            this.turnCount = 0;
            this.target = null;
            this.executorId = null;
            this.shownTurns = [];

            Object.keys(this.data.getAll()).forEach(i => this.data.remove(i));
            this.registry.set('battleStatus', battleStatus.started);

            this.scene.restart({'battle' : data.battle});
        }

        this.data.set('battle', data.battle);
    }

    preload ()
    {
        this.load.image('battleTileset', tileSetImage);

        let battle = this.data.get('battle');
        if(!battle){
            battle = BattleGenerator.generate({});
        }

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

        const hoverMarker = this.createTileSelector(markerType.hover);
        const selectMarker = this.createTileSelector(markerType.select);

        const gridUnits = this.drawCombatants(Object.values(battle.getCombatants(false)));

        this.scene.launch(cfg.scenes.battleUI, {
            battle: battle
        });

        this.data.set('hoverMarker', hoverMarker);
        this.data.set('selectMarker', selectMarker);
        this.data.set('gridUnits', gridUnits);

        const inputController = new BattleInputController({
            scene: this,
        });
        this.data.set('inputController', inputController);
    }

    update(time, delta){
        const inputController = this.data.get('inputController');
        const battle = this.data.get('battle');

        this.turnTimer += delta;
        // as sometimes we can lag a bit we do a loop 
        while (this.turnTimer > this.turndelay
            && battle.status !== battleStatus.finished
            /*&& this.turnCount < 10*/) {
            this.turnCount++;
            const turnResults = battle.nextTurn();
            // if battle in progress then update scene
            this.updateBattleScene(battle, turnResults);
            this.turnTimer -= this.turndelay;
        }
        this.registry.set('battleStatus', battle.status);
        if(battle.status === battleStatus.finished){
            this.turnTimer = 0;
            if(this.turnTimer > this.turndelay * 2){
                this.scene.pause();
            }

            // this.scene.start(cfg.scenes.navigation);
        }


        inputController.checkBtns();
    }

     /**
     * i need turn update not per time
     * @param {Battle} battle
     * @param {BattleLogItem} battleLogItem
     */
    updateBattleScene(battle, battleLogItem)
    {
        const gridUnits = this.data.get('gridUnits');
        if(this.target && this.target.combatant){
            gridUnits.find(c => c.combatant.id === this.target.combatant.id).setStyle(statusOption.default);
        }
        if(this.executorId){
            gridUnits.find(c => c.combatant.id === this.executorId).setStyle(statusOption.default);
        }

        this.target = battleLogItem.action.target ? battleLogItem.action.target : null;
        this.executorId = battleLogItem.executor.id;


        if(this.target && this.target.combatant){
            const targetObj = gridUnits.find(c => c.combatant.id === this.target.combatant.id)
            targetObj.setStyle(statusOption.target);
            targetObj.txtObj.setText(this.target.combatant.hp);
            if(this.target.combatant.hp <= 0){
                targetObj.crossObj.setVisible(true);
                // const targetTile = battle.arena.tilemap.getTileAt(this.target.combatant.coordinates.x,this.target.combatant.coordinates.y);
                // using reference of tile instead
                if(!this.target.tile.properties['corpses']){
                    this.target.tile.properties['corpses'] = [this.target.tile.properties['cmbId']]
                } else {
                    this.target.tile.properties['corpses'].push(this.target.tile.properties['cmbId'])
                }
                this.target.tile.properties['cmbId'] = null;
            }
        }


        const gridUnit = gridUnits.find(c => c.combatant.id === this.executorId);
        gridUnit.setStyle(statusOption.executor);

        if(this.shownTurns.length >= this.shownTurnCount){
            this.shownTurns.pop().destroy();
        }
        let turn = null;
        switch (battleLogItem.action.key) {
            case 'walk':
                turn = this.add.graphics();
                turn.lineStyle(this.unitSize/4, 0x00ff00, 1);
                console.log([
                    gridUnit.container.x,gridUnit.container.y,battleLogItem.executor.coordinates.x,battleLogItem.executor.coordinates.y
                ])
                turn.lineBetween(gridUnit.container.x + this.tileSize/2,gridUnit.container.y + this.tileSize/2,battleLogItem.executor.coordinates.x * this.tileSize + this.tileSize/2,battleLogItem.executor.coordinates.y * this.tileSize + this.tileSize/2);
                turn.setDepth(1);

                const originTile = battle.arena.tilemap.getTileAt(gridUnit.tileCoordinates.x,gridUnit.tileCoordinates.y);
                this.target.tile.properties['cmbId'] = originTile.properties['cmbId'];
                gridUnit.moveToCoords(battleLogItem.executor.coordinates);
                originTile.properties['cmbId'] = null;
                break;
            case 'attack':
                turn = this.add.graphics();
                turn.lineStyle(this.unitSize/4, 0xff0000, 1);
                turn.lineBetween(gridUnit.container.x + this.tileSize/2,gridUnit.container.y + this.tileSize/2,this.target.combatant.coordinates.x * this.tileSize + this.tileSize/2,this.target.combatant.coordinates.y * this.tileSize + this.tileSize/2);
                turn.setDepth(1);
                break;
            case 'wait':
                turn = this.add.circle(battleLogItem.executor.x, battleLogItem.executor.y, this.unitSize/4, 0xaaaaaa);
                break;
            default:
                console.log('none');
                break;
        }

        this.shownTurns.unshift(turn);
        console.log(battleLogItem);
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
                tileSize: this.tileSize,
                unitSize: this.unitSize,
                combatant: combatant,
            });
            gridUnit.addDefaultEvents();
            const tile = tilemap.getTileAt(combatant.coordinates.x, combatant.coordinates.y);
            tile.properties['cmbId'] = combatant.id;

            return gridUnit;
        }).flat();
      }

      createTileSelector(type) {
        //  Our painting marker
        let marker = this.add.graphics();
        marker.lineStyle(2, type.color, 1.0);
        marker.strokeRect(0, 0, this.tileSize, this.tileSize);
        marker.setVisible(false);
        return marker;
    }
    
}