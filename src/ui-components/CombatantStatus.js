import {styles} from "../styles";

export default class CombatantStatus
{
    /**
     * Currently adding some defaults cause lazy
     *
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     * @param {number} props.x=0
     * @param {number} props.y=0
     * @param {number} props.radius=64
     * @param {number} props.fill={styles.colors.btnBg}
     * @param {number} props.fillAlpha=1
     * @param {number} props.text=""
     * @param {number} props.textStyle
     *

     * @param {Object} props.border
     * @param {number} props.border.width
     * @param {number} props.border.color
     * @param {number} props.border.alpha
     * 
     * @param {Array} props.events
     * @param {string} props.cmbId
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
        this.radius = props.radius || 64;
        this.fill = props.fill || styles.colors.btnBg;
        this.fillAlpha = props.fillAlpha || 1;
        this.text = props.text || "";
        this.textStyle = props.textStyle || {};
        this.border = props.border || {
            width: styles.borderWidth,
            color: styles.colors.btnBorder
        };
        this.events = props.events || null;
        this.cmbId = props.cmbId || null;

        this.addCircle();
        this.addTxt();
        this.addCross();
    }

    addCircle()
    {
        this.btnObj = this.scene.add.circle(
            this.x,
            this.y,
            this.radius,
            this.fill,
            this.fillAlpha
        ).setOrigin(0);

        this.btnObj.setStrokeStyle(this.border.width, this.border.color);

        this.btnObj.setInteractive();
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

    addCross()
    {
        const btnCenter = this.btnObj.getCenter();
        this.crossObj = this.scene.add.text(
            btnCenter.x,
            btnCenter.y,
            'X',
            {fontSize: styles.fontSize.large, color: styles.textColors.red}
        ).setOrigin(0.5);
        this.crossObj.setVisible(false);
    }

    addDefaultEvents()
    {
        this.btnObj.on('pointerover', () => {
            this.btnObj.setFillStyle(styles.colors.btnBorder);
        }, this);
        this.btnObj.on('pointerout', () => {
            this.btnObj.setFillStyle(styles.colors.btnBg);
        }, this);
    }

    destroy()
    {
        this.btnObj.destroy();
        this.txtObj.destroy();
    }

}