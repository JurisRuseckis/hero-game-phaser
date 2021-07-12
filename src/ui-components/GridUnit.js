import {styles} from "../styles";

export const statusOption = {
    default : 0,
    executor : 1,
    target : 2,
    selected : 3,
};

export const teamColors = {
    1: styles.colors.team1,
    2: styles.colors.team2,
    3: styles.colors.team3,
    4: styles.colors.team4,
}

export default class GridUnit
{
    /**
     * Currently adding some defaults cause lazy
     *
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     *
     * @param {number} props.tileSize=0
     * @param {number} props.unitSize=0
     *
     * @param {Phaser.Math.Vector2} props.tileCoordinates
     * @param {Phaser.Math.Vector2} props.direction
     *
     * @param {number} props.fill={styles.colors.modernBtn}
     * @param {number} props.fillAlpha=1
     * @param {number} props.textStyle
     *
     * @param {Object} props.border
     * @param {number} props.border.width
     * @param {number} props.border.color
     * @param {number} props.border.alpha
     * 
     * @param {Combatant} props.combatant
     *
     */
    constructor(props)
    {
        if(!props.scene) {
            throw 'ArgumentException: missing scene';
        }
        if(!props.combatant) {
            throw 'ArgumentException: missing combatant';
        }


        this.combatant = props.combatant;

        // scene
        this.scene = props.scene;

        //size 
        this.tileSize = props.tileSize || 0;
        this.unitSize = props.unitSize || 0;
        this.radius = this.unitSize/2

        //position
        this.center = this.tileSize/2;
        /**
         *
         * @type {Phaser.Math.Vector2}
         */
        this.tileCoordinates = new Phaser.Math.Vector2(this.combatant.coordinates.x, this.combatant.coordinates.y);
        /**
         * unitVector
         * @type {Phaser.Math.Vector2}
         */
        this.direction = new Phaser.Math.Vector2(this.combatant.direction.x, this.combatant.direction.y);
        
        // fill & borders
        this.fill = teamColors[this.combatant.team];
        this.fillAlpha = props.fillAlpha || 1;
        this.border = props.border || {
            width: styles.borderWidth,
            color: styles.colors.modernBorder
        };
        this.status = statusOption.default;
        this.textStyle = props.textStyle || {};

        this.container = this.scene.add.container(this.tileCoordinates.x * this.tileSize, this.tileCoordinates.y * this.tileSize);

        this.addCircle();
        this.addTxt();
        this.addCross();
        this.addFieldOfView();
    }

    addCircle()
    {
        this.btnObj = this.scene.add.circle(
            this.center,
            this.center,
            this.radius,
            this.fill,
            this.fillAlpha
        ).setOrigin(0.5);

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
            this.combatant.hp.toString(),
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

    addFieldOfView(){
        const btnCenter = this.btnObj.getCenter();
        let graphics = this.scene.add.graphics({
            x: btnCenter.x,
            y: btnCenter.y
        });

        graphics.fillStyle(0xaaaaaa, .5);

        graphics.slice(0, 0, 32, Phaser.Math.DegToRad(60), Phaser.Math.DegToRad(-60), true);
    
        graphics.fillPath();

        this.fow = graphics;
        this.fow.setAngle(this.getAngle());
        // this.fow.setVisible(false);

        this.container.add(this.fow);
    }

    addDefaultEvents()
    {
        
        this.btnObj.on('pointerover', () => {
            if(this.status === statusOption.default) {
                this.btnObj.setFillStyle(this.fill);
            }
            // this.fow.setVisible(true);
        }, this);
        this.btnObj.on('pointerout', () => {
            if(this.status === statusOption.default){
                this.btnObj.setFillStyle(this.fill);
            }

            // this.fow.setVisible(false);
        }, this);
    }

    destroy()
    {
        this.container.destroy();
    }

    setStyle(status){
            this.status = status;
            switch(status){
                case statusOption.executor:
                    this.btnObj.setStrokeStyle(this.border.width, styles.colors.blue);
                    break;
                case statusOption.target:
                    this.btnObj.setStrokeStyle(this.border.width, styles.colors.red);
                    break;
                case statusOption.selected:
                    this.btnObj.setFillStyle(styles.colors.green);
                    break;
                case statusOption.default:
                default:
                    this.btnObj.setStrokeStyle(this.border.width, this.border.color).setFillStyle(this.fill);
                    break;
            }
    }

    moveToCoords(tilePosition){
        this.direction.set(tilePosition.x - this.tileCoordinates.x,tilePosition.y - this.tileCoordinates.y);
        const distance = this.direction.length();
        this.direction.normalize();
        this.tileCoordinates.set(tilePosition.x,tilePosition.y);

        this.scene.tweens.add({
            targets: this.fow,
            duration: this.scene.turndelay,
            angle: this.getAngle(),
            delay: 0,
            repeat: 0,
        });

        this.scene.tweens.add({
            targets: this.container,
            duration: distance * this.scene.turndelay,
            x: this.tileCoordinates.x * this.tileSize,
            y: this.tileCoordinates.y * this.tileSize,
            delay: 0,
            repeat: 0,
        });
    }

    getAngle(){
        return Math.atan2(this.direction.y, this.direction.x) * 180 / Math.PI;
    }
}