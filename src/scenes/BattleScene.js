import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Btn from "../ui-components/Btn";
import {Combatant} from "../models/Combatant";
import Battle from "../models/Battle";
import CombatAction from "../models/CombatAction";
import Character from "../models/Character";

/**
 * @type {CombatAction[]}
 */
 const testActions = [
    new CombatAction({
        key: 'wait',
        operation: (combatant, target) => {
            combatant.turnMeter = 0;
            return `${combatant.label} waits`;
        }
    }),
    new CombatAction({
        key: 'attack',
        text: '',
        operation: (combatant, target) => {
            combatant.turnMeter = 0;
            // todo: add arena effects
            // todo: add target effects
            const dmg = combatant.calculateDmg();
            target.hp -= dmg;
            return `${combatant.label} Attacks ${target.label} for ${dmg} damage!`;
        }
    }),
];
/**
 *
 * @type {({character: Character, team: number})[]}
 */
const testBattleTeams = [
    {
        team: 1,
        character: new Character({
            name: 'man',
            baseHP: 100,
            baseSpeed: 0.1,
            atk: 1,
            isPlayable: true,
            combatActions: testActions,
            duelActions: [],
        })
    },
    {
        team: 2,
        character: new Character({
            name: 'thief',
            baseHP: 10,
            baseSpeed: 0.5,
            atk: 1,
            combatActions: testActions,
            duelActions: [],
        })
    },
]

export class BattleScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.battle
        });
    }

    preload ()
    {
        const battle = new Battle({
            combatants: testBattleTeams.map((combatant) => {
                return new Combatant({
                    character: combatant.character,
                    team: combatant.team
                });
            }),
            scene: this
        });
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
        this.updateBattleScene(battle);
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
     */
    updateBattleScene(battle)
    {
        // todo: rename battle scene to avoid confusion
        this.updateBattleScene(battle);
    }

    /**
     * @param {Battle} battle
     */
    updateBattleScene(battle)
    {
        //update hp and alive status for chars 
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
            {fontSize: styles.fontSize.default},
        );

        /**
         *
         * @type {Battle}
         */
        const battle = this.data.get('battle');
        // add hp for all dudes 
    }

    /**
     * @param props
     */
    showResults(props)
    {
        console.log('result window');
        // this.battleResultWindow = this.add.rectangle(
        //     this.boxContainerBounds.left + styles.padding,
        //     this.battleWindowBounds.bottom + styles.padding + 100,
        //     styles.grid.window - styles.padding*2,
        //     600,
        //     styles.colors.btnBg,
        // ).setOrigin(0);
        // this.battleResultWindow.setStrokeStyle(styles.borderWidth, styles.colors.windowBorder);
        // win/lost
        // winner team
        // loot for winner
    }
}