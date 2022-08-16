import Phaser from "phaser";
import { cfg } from "../cfg";
import tileSetImage from "../assets/tileset.png";
import GridUnit, {statusOption} from "../battle-grid-components/GridUnit";
import Battle, { battleStatus } from "../models/Battle";
import {styles} from "../styles";
import BattleInputController from "../controllers/BattleInputController";

export class BattleSimulatorScene extends Phaser.Scene {
    constructor() {
        super({
            key: cfg.scenes.battleSimulator
        });

        this.debugMode = false;
        
        this.finishedBattles = 0;
        this.battleThreshold = 10;
        this.battleSummaries = [];

        this.turndelay = 1;
        this.turnCount = 0;

        this.tileSize = 48;
        this.unitSize = 32;
    }

    init(data) {
        if (this.turnCount > 0) {
            this.battleSummaries = [];
            this.finishedBattles = 0;
            this.turnCount = 0;
            this.target = null;
            this.executorId = null;

            Object.keys(this.data.getAll()).forEach(i => this.data.remove(i));

            this.scene.restart({ 'battle': data.battle });
        }
        this.data.set('battle', data.battle);
        const battleTemplate = new Battle({...data.battle})
        battleTemplate.removeRefs();
        this.data.set('battleTemplate', battleTemplate);
    }

    preload() {
        this.load.image('battleTileset', tileSetImage);

        let battle = this.data.get('battle');
        if (!battle) {
            return;
        }

        this.data.set('battle', battle);
    }

    create() {
        this.add.text(-100,-100, 'processing...',{fontSize: styles.fontSize.large}).setName('progress')
        this.setupBattle();
    }

    update(time, delta) {
        const battle = this.data.get('battle');

        if (battle.status === battleStatus.started) {
            // if battle is ongoing then calculate nextTurn
            this.turnCount++;
            const turnResults = battle.nextTurn();
            // if battle in progress then update scene
            this.updateBattleScene(battle, turnResults);
            // console.log(turnResults);
        }

        if (battle.status === battleStatus.finished) {
            //reset battle itself, tilemap and combatants
            this.finishedBattles++;
            this.battleSummaries.push(battle.getBattleSummary());
            this.children.getByName('progress').setText(`processing... ${(this.finishedBattles * 100)/this.battleThreshold}%`)

            if(this.finishedBattles >= this.battleThreshold){
                console.table(this.battleSummaries.map((summary) => {
                    const leftoverHP = summary.rawData.winnerStats.leftoverHP;
                    const winDifference = (summary.rawData.winnerStats.leftoverHP * 100)/summary.rawData.teamStats[summary.rawData.winners].totalHP;

                    return {
                        'belligerents': summary.texts.belligerents,
                        'winners': summary.texts.winners,
                        'winnerTeamIndice': summary.rawData.winners,
                        'winnerLeftoverHP' : leftoverHP,
                        'winDifference': winDifference
                    }
                }));
                this.scene.start(cfg.scenes.navigation);
            }

            this.setupBattle();
        }

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
        if (this.target && this.target.combatant) {
            gridUnits.find(c => c.combatant.id === this.target.combatant.id).setStyle(statusOption.default);
        }
        // reset executor from previous turn
        if (this.executorId) {
            gridUnits.find(c => c.combatant.id === this.executorId).setStyle(statusOption.default);
        }

        // set new target and executor
        this.target = battleLogItem.action.target ? battleLogItem.action.target : null;
        this.executorId = battleLogItem.executor.id;


        // handle target visuals and tileprops if it died
        if (this.target && this.target.combatant) {
            const targetObj = gridUnits.find(c => c.combatant.id === this.target.combatant.id)
            targetObj.setStyle(statusOption.target);
            targetObj.txtObj.setText(this.target.combatant.hp);
            if (this.target.combatant.hp <= 0) {
                targetObj.crossObj.setVisible(true);
                if (!this.target.tile.properties['corpses']) {
                    this.target.tile.properties['corpses'] = [this.target.tile.properties['cmbId']]
                } else {
                    this.target.tile.properties['corpses'].push(this.target.tile.properties['cmbId'])
                }
                this.target.tile.properties['cmbId'] = null;
            }
        }

        // handle executor visuals
        const gridUnit = gridUnits.find(c => c.combatant.id === this.executorId);

        switch (battleLogItem.action.key) {
            case 'walk':
            case 'charge':
                const originTile = battle.arena.tilemap.getTileAt(gridUnit.tileCoordinates.x, gridUnit.tileCoordinates.y);
                this.target.tile.properties['cmbId'] = originTile.properties['cmbId'];
                gridUnit.moveToCoords(battleLogItem.executor.coordinates);
                originTile.properties['cmbId'] = null;
                break;
            default:
                break;
        }

    }

    setupBattle(){
        Object.keys(this.data.getAll()).filter((d) => d !== 'battleTemplate').forEach(i => this.data.remove(i));
        this.children.getAll().forEach((c) => {
            if(c.name !== 'progress') c.destroy();
        })
        // todo: cleanup old data
        this.turnCount = 0;
        this.target = null;
        this.executorId = null;
        // this will set and reset battle and tilegrid
        const battle = new Battle({...this.data.get('battleTemplate')});
        battle.removeRefs();
        this.data.set('battle', battle);


        const tilemap = this.make.tilemap({ tileWidth: this.tileSize, tileHeight: this.tileSize });
        const tileSet = tilemap.addTilesetImage('battleTileset', null, this.tileSize, this.tileSize, 0, 0);
        const tileGridLayer = tilemap.createBlankLayer('battleGridLayer', tileSet, 0, 0, battle.arena.width, battle.arena.height);
        tilemap.putTilesAt(battle.arena.tiles, 0, 0, true, tileGridLayer);
        // tileGridLayer.setVisible(false);
        battle.arena.tilemap = tilemap;
        this.data.set('tilemap', tilemap);

        const gridUnits = Object.values(battle.getCombatants(false)).map((combatant) => {
            const gridUnit = new GridUnit({
                scene: this,
                tileSize: this.tileSize,
                unitSize: this.unitSize,
                combatant: combatant,
            });
            gridUnit.addDefaultEvents();
            // gridUnit.container.setVisible(false);
            const tile = tilemap.getTileAt(combatant.coordinates.x, combatant.coordinates.y);
            tile.properties['cmbId'] = combatant.id;

            return gridUnit;
        }).flat();

        this.data.set('gridUnits', gridUnits);

        const inputController = new BattleInputController({
            scene: this,
            disableInput: true
        });
        this.data.set('inputController', inputController);

        battle.status = battleStatus.started;
    }

}