import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";
import Duel from "../models/Duel";
import Character from "../models/Character";

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

        this.data.set('duel', new Duel({
            combatants: [
                new Character({
                    name: "general",
                    baseHP: 100,
                    baseSpeed: 0.4,
                }),
                new Character({
                    name: "peasant",
                    baseHP: 10,
                    baseSpeed: 0.1,
                }),
                new Character({
                    name: "ranger",
                    baseHP: 20,
                    baseSpeed: 0.3,
                }),
                new Character({
                    name: "footman",
                    baseHP: 40,
                    baseSpeed: 0.2,
                }),
            ]
        }));
    }

    update(time, delta) {
        super.update(time, delta);
        const duel = this.data.get('duel');
        duel.update();
    }
}