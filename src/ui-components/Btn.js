import {styles} from "../styles";

export default class Btn
{
    /**
     * Currently adding some defaults cause lazy
     *
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     * @param {number} props.x=0
     * @param {number} props.y=0
     * @param {number} props.width=128
     * @param {number} props.height=128
     * @param {number} props.fill={styles.colors.modernBtn}
     * @param {number} props.fillAlpha=1
     * @param {number} props.text=""
     * @param {number} props.textStyle
     *

     * @param {Object} props.border
     * @param {number} props.border.width
     * @param {number} props.border.color
     * @param {number} props.border.alpha
     *
     */
    constructor(props)
    {
        if(!props.scene) {
            throw 'ArgumentException: missing scene';
        }

        this.scene = props.scene;
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = props.width || 128;
        this.height = props.height || 128;
        this.fill = props.fill || styles.colors.modernBtn;
        this.fillAlpha = props.fillAlpha || 1;
        this.text = props.text || "";
        this.textStyle = props.textStyle || {};
        this.border = props.border || {
            width: styles.borderWidth,
            color: styles.colors.modernBorder
        };

        this.addBtn();
        this.addTxt();

        this.container = this.scene.add.container(this.x, this.y, [
            this.btnObj,
            this.txtObj,
        ]);
    }

    addBtn()
    {
        this.btnObj = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            this.fill,
            this.fillAlpha
        ).setOrigin(0);

        this.btnObj.setStrokeStyle(this.border.width, this.border.color);
    }

    addTxt()
    {
        const btnCenter = this.btnObj.getCenter();
        this.txtObj = this.scene.add.text(
            btnCenter.x,
            btnCenter.y,
            this.text,
            this.textStyle
        ).setOrigin(0.5);
    }

    addDefaultEvents()
    {
        this.btnObj.setInteractive();
        this.btnObj.on('pointerover', () => {
            this.btnObj.setFillStyle(styles.colors.modernBorder);
        }, this);
        this.btnObj.on('pointerout', () => {
            this.btnObj.setFillStyle(styles.colors.modernBtn);
        }, this);
    }

    destroy()
    {
        this.container.destroy();
    }

}