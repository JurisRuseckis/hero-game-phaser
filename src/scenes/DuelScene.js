import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Duel from "../models/Duel";
import Character from "../models/Character";
import man from "../assets/images/man.png";
import thief from "../assets/images/thief.png";

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
            combatants: [
                new Character({
                    name: 'man',
                    baseHP: 100,
                    baseSpeed: 0.4,
                    atk: 1,
                    img: man
                }),
                new Character({
                    name: 'thief',
                    baseHP: 10,
                    baseSpeed: 0.3,
                    atk: 1,
                    img: thief
                }),
            ]
        });
        this.data.set('duel', duel);
        // player always will be first
        this.load.image('player', duel.combatants[0].character.img);
        // enemy always will be second
        this.load.image('enemy', duel.combatants[1].character.img);

    }

    create ()
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

        this.attackBtn = this.add.rectangle(
            this.boxContainerBounds.centerX,
            this.battleWindowBounds.bottom + styles.padding + 100,
            this.boxContainer.width - styles.padding *2,
            200,
            styles.colors.btnBg
        );
        this.attackBtn.setStrokeStyle(styles.borderWidth, styles.colors.btnBorder);

        const btnCenter = this.attackBtn.getCenter();
        // smth wrong with buttontext it throws err
        this.atackBtnTxt = this.add.text(
            btnCenter.x,
            btnCenter.y,
            "Attack",
            {fontSize: styles.fontSize.large}
        ).setOrigin(0.5);

        this.attackBtn.setInteractive();
        this.attackBtn.on('pointerover', () => {
            this.attackBtn.setFillStyle(styles.colors.btnBorder);
        }, this);
        this.attackBtn.on('pointerout', () => {
            this.attackBtn.setFillStyle(styles.colors.btnBg);
        }, this);
        this.attackBtn.on('pointerdown', ()=>{
            duel.update();
            const player = duel.combatants.filter(x => x.label === 'man');
            const enemy = duel.combatants.filter(x => x.label === 'thief');
            this.playerHP.setText(`${player[0].hp}/${player[0].calculateHP()}`);
            if(duel.combatants.length < 2){
                this.enemyHP.setText(`${duel.corpses[0].hp}/${duel.corpses[0].calculateHP()}`);
            } else {
                this.enemyHP.setText(`${enemy[0].hp}/${enemy[0].calculateHP()}`);
            }

        });
    }

    // update(time, delta) {
    //     super.update(time, delta);
    //     const duel = this.data.get('duel');
    //     duel.update();
    // }
}