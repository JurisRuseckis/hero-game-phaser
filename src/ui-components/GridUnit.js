import {styles} from "../styles";

export const statusOption = {
    default : 0,
    executor : 1,
    target : 2,
};

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
     * @param {string} props.cmbId
     *
     */
    constructor(props)
    {
        if(!props.scene) {
            throw 'ArgumentException: missing scene';
        }

        // scene
        this.scene = props.scene;

        //size 
        this.tileSize = props.tileSize || 0;
        this.unitSize = props.unitSize || 0;
        this.offset = (this.tileSize - this.unitSize)/2
        this.radius = this.unitSize/2

        //coords
        this.tileCoords = props.tileCoords || {x:0,y:0};
        this.x = this.tileCoords.x * this.tileSize;
        this.y = this.tileCoords.y * this.tileSize;
        
        // fill & borders
        this.fill = props.fill || styles.colors.btnBg;
        this.fillAlpha = props.fillAlpha || 1;
        this.border = props.border || {
            width: styles.borderWidth,
            color: styles.colors.btnBorder
        };

        // text
        this.text = props.text || "";
        this.textStyle = props.textStyle || {};

        
        this.cmbId = props.cmbId || null;

        this.container = this.scene.add.container(this.x, this.y);

        this.addCircle();
        this.addTxt();
        this.addCross();
    }

    addCircle()
    {
        this.btnObj = this.scene.add.circle(
            this.offset,
            this.offset,
            this.radius,
            this.fill,
            this.fillAlpha
        ).setOrigin(0);

        this.btnObj.setStrokeStyle(this.border.width, this.border.color);

        this.btnObj.setInteractive();

        this.container.add(this.btnObj);
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

        this.container.add(this.txtObj);
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

        this.container.add(this.crossObj);
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
        this.container.destroy();
    }

    setStyle(status){
            switch(status){
                case statusOption.executor:
                    this.btnObj.setStrokeStyle(this.border.width, styles.colors.blue).setFillStyle(styles.colors.blue);
                    break;
                case statusOption.target:
                    this.btnObj.setStrokeStyle(this.border.width, styles.colors.red).setFillStyle(styles.colors.red);
                    break;
                case statusOption.default:
                default:
                    this.btnObj.setStrokeStyle(this.border.width, this.border.color).setFillStyle(this.fill);
                    break;
            }
    }

    moveToCoords(coords){
        this.container.x = this.x = coords.x * this.tileSize;
        this.container.y = this.y = coords.y * this.tileSize;
    }
}