import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Duel from "../models/Duel";
import Character from "../models/Character";
import man from "../assets/images/man.png";
import thief from "../assets/images/thief.png";
import Btn from "../ui-components/Btn";
import DuelAction from "../models/DuelAction";
import {Combatant} from "../models/Combatant";

/**
 * @type {DuelAction[]}
 */
const testActions = [
    new DuelAction({
        key: 'wait',
        operation: (combatant, target) => {
            combatant.turnMeter = 0;
            console.log(`${combatant.label} waits`)
        }
    }),
    new DuelAction({
        key: 'attack',
        text: '',
        operation: (combatant, target) => {
            combatant.turnMeter = 0;
            // todo: add arena effects
            // todo: add target effects
            const dmg = combatant.calculateDmg();
            target.hp -= dmg;
            console.log(`${combatant.label} Attacks ${target.label} for ${dmg} damage!`)
        }
    }),
];
/**
 *
 * @type {({character: Character, team: number})[]}
 */
const testDuelTeams = [
    {
        team: 1,
        character: new Character({
            name: 'man',
            baseHP: 100,
            baseSpeed: 0.1,
            atk: 1,
            img: man,
            isPlayable: true,
            duelActions: testActions
        })
    },
    {
        team: 2,
        character: new Character({
            name: 'thief',
            baseHP: 10,
            baseSpeed: 0.5,
            atk: 1,
            img: thief,
            duelActions: testActions
        })
    },
]

export class DuelScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.duel
        });
    }

    preload ()
    {
        const duel = new Duel({
            combatants: testDuelTeams.map((combatant) => {
                return new Combatant({
                    character: combatant.character,
                    team: combatant.team
                });
            }),
            scene: this
        });
        this.data.set('duel', duel);
        // player always will be first
        this.load.image('player', duel.combatants[0].character.img);
        // enemy always will be second
        this.load.image('enemy', duel.combatants[1].character.img);

    }

    create ()
    {
        this.addBattleScene();
        this.actionBtns = [];
        /**
         *
         * @type {Duel}
         */
        const duel = this.data.get('duel');

        // initial update to fill first turn meters
        duel.init();
        this.updateBattleScene(duel);
    }

    /**
     * @param {DuelAction[]} actions
     */
    updateActionBtns(actions){
        /**
         *
         * @type {Duel}
         */
        const duel = this.data.get('duel');

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
                duel.handleTurn(action);
                this.updateDuelScene(duel)
            });
        })
    }

    /**
     * i need turn update not per time
     * @param {Duel} duel
     */
    updateDuelScene(duel){
        // todo: rename battle scene to avoid confusion
        this.updateBattleScene(duel);
    }

    /**
     * @param {Duel} duel
     */
    updateBattleScene(duel){
        const player = duel.combatants.filter(x => x.label === 'man');
        const enemy = duel.combatants.filter(x => x.label === 'thief');
        this.playerHP.setText(`${player[0].hp}/${player[0].calculateHP()}`);
        if(duel.combatants.length < 2){
            this.enemyHP.setText(`${duel.corpses[0].hp}/${duel.corpses[0].calculateHP()}`);
        } else {
            this.enemyHP.setText(`${enemy[0].hp}/${enemy[0].calculateHP()}`);
        }
    }

    addBattleScene(){
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
            "Duel",
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

        const playerSprite = this.add.image(this.battleWindowBounds.left + 100, this.battleWindowBounds.centerY, 'player');
        const enemySprite = this.add.image(this.battleWindowBounds.right - 100, this.battleWindowBounds.centerY, 'enemy');
        enemySprite.setFlipX(true);

        /**
         *
         * @type {Duel}
         */
        const duel = this.data.get('duel');
        this.playerHP = this.add.text(
            this.battleWindowBounds.left + 100,
            this.battleWindowBounds.bottom - 50,
            `${duel.combatants[0].calculateHP()}/${duel.combatants[0].calculateHP()}`,
            {fontSize: styles.fontSize.default}
        ).setOrigin(0.5);

        this.enemyHP = this.add.text(
            this.battleWindowBounds.right - 100,
            this.battleWindowBounds.bottom - 50,
            `${duel.combatants[1].calculateHP()}/${duel.combatants[1].calculateHP()}`,
            {fontSize: styles.fontSize.default}
        ).setOrigin(0.5);
    }

    // update(time, delta) {
    //     super.update(time, delta);
    //     const duel = this.data.get('duel');
    //     duel.update();
    // }
}