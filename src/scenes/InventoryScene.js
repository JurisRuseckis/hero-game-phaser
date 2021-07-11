import Phaser from "phaser";
import {cfg} from "../cfg";
import {styles} from "../styles";

export class InventoryScene extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: cfg.scenes.inventory
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
            "Inventory",
            {fontSize: styles.fontSize.title}
        ).setOrigin(0.5,0);

        this.invGrid = this.createGrid();
    }

    createGrid(){
        const slotsInRow = 6;
        // width - container padding - space between slots, divided by slots wanted
        const slotSize = (this.boxContainer.width - styles.padding * (1 + slotsInRow)) / slotsInRow;
        const rows = Math.floor((this.boxContainer.height - this.boxTitle.height - styles.padding * 2 - slotSize/2 ) / (slotSize+styles.padding));

        let grid = [];
        const startX = this.boxContainerBounds.left + styles.padding + slotSize/2;
        const startY =  this.boxContainerBounds.top + this.boxTitle.height + styles.padding * 2 + slotSize/2;
        // as it is square...
        const step = slotSize + styles.padding;

        for(let i=0;i<rows;i++){
            let row = [];
            for(let j=0;j<slotsInRow;j++){
                const slot = this.add.rectangle(
                    startX + j * step,
                    startY + i * step,
                    slotSize,
                    slotSize,
                    styles.colors.modernBtn
                );
                this.boxContainer.setStrokeStyle(styles.borderWidth, styles.colors.modernBorder);

                slot.setInteractive();
                slot.on('pointerover', () => {
                    slot.setFillStyle(styles.colors.modernBorder);
                }, this);
                slot.on('pointerout', () => {
                    slot.setFillStyle(styles.colors.modernBtn);
                }, this);

                row.push(slot);
            }
            grid.push(row);
        }

        return grid;
    }

}