import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Btn from "../ui-components/Btn";
import {Combatant} from "../models/Combatant";
import Battle, { battleStatus } from "../models/Battle";
import CombatAction from "../models/CombatAction";
import BattleGenerator from "../models/Generators/BattleGenerator";
import CombatantStatus, { statusOption } from "../ui-components/CombatantStatus";

//todo: rename this to brawl
export class BattleScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.battle
        });

        this.turndelay = 10;
        this.turnTimer = 0;
    }

    preload ()
    {
        const battle = BattleGenerator.generate();
        this.data.set('battle', battle);
    }

    create ()
    {
        this.addBattleScene();
        this.actionBtns = [];
        /**
         *
         * @type {Battle}
         */
        const battle = this.data.get('battle');

        // initial update to fill first turn meters
        battle.init();
    }

    /**
     * @param {CombatAction[]} actions
     */
    updateActionBtns(actions)
    {
        /**
         *
         * @type {Battle}
         */
        const battle = this.data.get('battle');

        this.actionBtns.map((action) => {
            action.destroy();
        })
        this.actionBtns = [];

        actions.map((action, index)=>{
            const btn = new Btn({
                scene: this,
                x: this.boxContainerBounds.left + styles.padding,
                y: this.battleWindowBounds.bottom + styles.padding + 100 + (200 + styles.padding)*index,
                width: styles.grid.window - styles.padding*2,
                height: 200,
                text: action.key,
                textStyle: {fontSize: styles.fontSize.large}
            });
            btn.addDefaultEvents();
            btn.btnObj.on('pointerdown', ()=>{
                battle.handleTurn(action);
                this.updateBattleScene(battle)
            });
            this.actionBtns.push(btn);
        })
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

    addBattleScene()
    {
        this.boxContainer = this.add.rectangle(
            styles.viewPort.centerX,
            styles.panelLayout.contentStart,
            styles.grid.window,
            styles.panelLayout.contentHeight,
            styles.colors.windowBg
        ).setOrigin(0.5,0);
        this.boxContainer.setStrokeStyle(styles.borderWidth, styles.colors.windowBorder);

        this.boxContainerBounds = this.boxContainer.getBounds();

        this.boxTitle = this.add.text(
            this.boxContainer.x,
            this.boxContainerBounds.top + styles.padding,
            "Battle",
            {fontSize: styles.fontSize.title}
        ).setOrigin(0.5,0);

        const startX = this.boxContainerBounds.left + styles.padding;

        this.battleWindow = this.add.rectangle(
            this.boxContainerBounds.centerX,
            this.boxContainerBounds.top + this.boxTitle.height + styles.padding * 2 + 200,
            this.boxContainer.width - styles.padding * 2,
            400,
            styles.colors.btnBg
        );
        this.battleWindow.setStrokeStyle(styles.borderWidth, styles.colors.btnBorder);
        this.battleWindowBounds = this.battleWindow.getBounds();

        this.actionText = this.add.text(
            this.boxContainerBounds.left + styles.padding,
            this.battleWindowBounds.bottom + styles.padding,
            "Placeholder",
            {
                fontSize: styles.fontSize.default, 
                wordWrap: {
                    width: this.battleWindow.width - 2 * styles.padding
                }
            },
        );

        /**
         *
         * @type {Battle}
         */
        const battle = this.data.get('battle');
        // add all combatants
        this.combatantStatuses = Object.values(battle.getCombatants(true)).map((team, teamIndex)=>{
            const radius = 16;

            return team.map((combatant, combatantIndex) =>{
                return new CombatantStatus({
                    scene: this,
                    x: this.battleWindowBounds.left + styles.padding + combatantIndex * (radius * 2 + styles.padding),
                    y: this.battleWindowBounds.top + styles.padding + teamIndex * (radius * 2 + styles.padding * 1.5),
                    radius: radius,
                    text: combatant.hp,
                    cmbId: combatant.id
                })
            });
        }).flat();
    }

    /**
     * @param props
     */
    showResults(props)
    {
        console.log('result window');
    }

    update(time, delta){
        this.turnTimer += delta;
        // as sometimes we can lag a bit we do a loop 
        while (this.turnTimer > this.turndelay) {
            /**
             *
             * @type {Battle}
             */
            const battle = this.data.get('battle');
            const turnResults = battle.nextTurn();
            // if battle in progress then update scene
            if(battle.status !== battleStatus.finished){
                this.updateBattleScene(battle, turnResults.executor, turnResults.action);
            }
            
            
            this.turnTimer -= this.turndelay;
        }
    }
}