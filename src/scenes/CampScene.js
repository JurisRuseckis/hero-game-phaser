import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";

export class CampScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.camp
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
            styles.colors.modernBg
        ).setOrigin(0.5,0);
        this.boxContainer.setStrokeStyle(styles.borderWidth, styles.colors.modernBorder);

        this.boxContainerBounds = this.boxContainer.getBounds();
        this.boxTitle = this.add.text(
            this.boxContainer.x,
            this.boxContainerBounds.top + styles.padding,
            "Camp",
            {fontSize: styles.fontSize.title}
        ).setOrigin(0.5,0);

    }
}