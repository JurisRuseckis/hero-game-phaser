import Phaser from "phaser";
import {cfg} from "../cfg";
import tileSetImage from "../assets/tileset.png";
import BattleInputController from "../controllers/BattleInputController";
import BattleGenerator from "../models/Generators/BattleGenerator";
import GridUnit, { statusOption } from "../battle-grid-components/GridUnit";
import { battleStatus } from "../models/Battle";
import {styles} from "../styles";

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

        this.debugMode = false;

        this.turndelay = 200;
        this.turnTimer = 0;
        this.turnCount = 0;

        this.tileSize = 48;
        this.unitSize = 32;

        this.shownTurnCount = 2;
        this.shownTurns = [];
        this.shownPathFinding = [];
    }

    init(data){
        if(this.turnCount > 0 ){
            this.turnTimer = 0;
            this.turnCount = 0;
            this.target = null;
            this.executorId = null;
            this.shownTurns = [];

            Object.keys(this.data.getAll()).forEach(i => this.data.remove(i));

            this.scene.restart({'battle' : data.battle});
        }

        this.data.set('battle', data.battle);
    }

    preload () {
        this.load.image('battleTileset', tileSetImage);

        let battle = this.data.get('battle');
        if(!battle){
            battle = BattleGenerator.generate({});
        }

        this.data.set('battle', battle);
    }

    create () {
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

        if(battle.status === battleStatus.started){
            // if battle is ongoing then count time 
            this.turnTimer += delta;
        }
        
        // as sometimes we can lag a bit we do a loop 
        while (this.turnTimer > this.turndelay
            && battle.status === battleStatus.started
            /*&& this.turnCount < 1*/) {
            this.turnCount++;
            const turnResults = battle.nextTurn();
            // if battle in progress then update scene
            this.updateBattleScene(battle, turnResults);
            this.turnTimer -= this.turndelay;
        }
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
    updateBattleScene(battle, battleLogItem) {
        // all units that are alive
        const gridUnits = this.data.get('gridUnits');

        // reset target from previous turn
        if(this.target && this.target.combatant){
            gridUnits.find(c => c.combatant.id === this.target.combatant.id).setStyle(statusOption.default);
        }
        // reset executor from previous turn
        if(this.executorId){
            gridUnits.find(c => c.combatant.id === this.executorId).setStyle(statusOption.default);
        }

        // set new target and executor
        this.target = battleLogItem.action.target ? battleLogItem.action.target : null;
        this.executorId = battleLogItem.executor.id;


        // handle target visuals and tileprops if it died
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

        // handle executor visuals
        const gridUnit = gridUnits.find(c => c.combatant.id === this.executorId);
        gridUnit.setStyle(statusOption.executor);

        this.handleActionVisuals(battle, battleLogItem, gridUnit);

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

    handleActionVisuals(battle, battleLogItem, gridUnit) {
        // clear old turns
        if(this.shownTurns.length >= this.shownTurnCount){
            Object.values(this.shownTurns.pop()).forEach((destroyable) => {
                destroyable.destroy();
            })
        }

        if(this.shownPathFinding.length > 0){
            this.shownPathFinding.forEach((tile) => {
                Object.values(tile).forEach((destroyable) => {
                    destroyable.destroy();
                })
            })
           this.shownPathFinding = [];
        }

        let turnObjs = {};
        switch (battleLogItem.action.key) {
            case 'walk':
                if(this.debugMode){
                    //movement direction
                    turnObjs.arrowLine = this.add.graphics();
                    turnObjs.arrowLine.lineStyle(this.unitSize/4, 0x00ff00, 1);
                    turnObjs.arrowLine.lineBetween(gridUnit.container.x + this.tileSize/2,gridUnit.container.y + this.tileSize/2,battleLogItem.executor.coordinates.x * this.tileSize + this.tileSize/2,battleLogItem.executor.coordinates.y * this.tileSize + this.tileSize/2);
                    turnObjs.arrowLine.setDepth(1);

                    //path finding
                    const consideredTiles =  battle.arena.tilemap.getTilesWithin().filter(tile => tile.properties[gridUnit.combatant.id]);

                    this.shownPathFinding = consideredTiles.map(tile => {
                        const tileProperties = tile.properties[gridUnit.combatant.id];
                        const fCost = tileProperties.hCost + tileProperties.gCost;
                        const inPath = battleLogItem.executor.currentPath.includes(tile);
                        const availableMoveTarget = battleLogItem.executor.moveTargets.map(tile => tile.tile).includes(tile);
                        const isTarget = battleLogItem.action.target.tile === tile;

                        let circleColor = 0xaaaaaa;
                        if(isTarget){
                            circleColor = 0xff0000;
                        } else if(inPath && availableMoveTarget){
                            circleColor = 0x00ffff;
                        } else if(inPath){
                            circleColor = 0x00ff00;
                        } else if(availableMoveTarget){
                            circleColor = 0x0000ff;
                        }

                        const circle = this.add.circle(tile.pixelX + this.tileSize/2,tile.pixelY + this.tileSize/2, this.unitSize/2, circleColor);
                        const circleCenter = circle.getCenter();


                        return {
                            circle: circle,
                            text: this.add.text(circleCenter.x,circleCenter.y,fCost).setOrigin(0.5).setDepth(1)
                        };
                    });


                }

                const originTile = battle.arena.tilemap.getTileAt(gridUnit.tileCoordinates.x,gridUnit.tileCoordinates.y);
                this.target.tile.properties['cmbId'] = originTile.properties['cmbId'];
                gridUnit.moveToCoords(battleLogItem.executor.coordinates);
                originTile.properties['cmbId'] = null;
                break;
            case 'attack':
                if(this.debugMode){
                    turnObjs.arrowLine = this.add.graphics();
                    turnObjs.arrowLine.lineStyle(this.unitSize/4, 0xff0000, 1);
                    turnObjs.arrowLine.lineBetween(gridUnit.container.x + this.tileSize/2,gridUnit.container.y + this.tileSize/2,this.target.combatant.coordinates.x * this.tileSize + this.tileSize/2,this.target.combatant.coordinates.y * this.tileSize + this.tileSize/2);
                    turnObjs.arrowLine.setDepth(1);
                }

                break;
            case 'wait':
                if(this.debugMode){
                    turnObjs.circle = this.add.circle(gridUnit.container.x + this.tileSize/2,gridUnit.container.y + this.tileSize/2, this.unitSize/4, 0xaaaaaa);
                }

                break;
            default:
                console.log('none');
                break;
        }
        if(this.debugMode){
            // const arrowTriangle = this.add.triangle()
            const text = this.add.text(gridUnit.container.x + this.tileSize/2,gridUnit.container.y + this.tileSize/2,this.turnCount).setBackgroundColor(styles.colors.black);
            text.setDepth(1);

            this.shownTurns.unshift({
                ...turnObjs,
                text : text,
            });
        }
    }
    
}