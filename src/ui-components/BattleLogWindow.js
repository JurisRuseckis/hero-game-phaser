import {styles} from "../styles";

export const uiAlignment = {
    topLeft: 1,
    top: 2,
    topRight: 3,
    middleLeft: 4,
    middle: 5,
    middleRight: 6,
    bottomLeft: 7,
    bottom: 8,
    bottomRight: 9,
}

export default class BattleLogWindow
{
    /**
     * 
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     * @param {BattleLog} props.battleLog
     * @param {number} props.alignment
     */
    constructor(props) {
        this.scene = props.scene;
        this.battleLog = props.battleLog;
        this.alignment = props.alignment;

        // this.width = this.scene.scale.width / 3;
        // this.height = this.width * 1.2;

        this.width = styles.isMobile ? styles.grid.window : styles.viewPort.width * 0.6;
        this.height = styles.isMobile ? styles.grid.window * 0.2 : styles.viewPort.width * 0.2;
        this.margin = styles.padding;

        if(this.alignment !== uiAlignment.bottomLeft){
            throw "not implemented";
        }

        // if bottom left
        this.x = this.margin / this.scene.scale.displayScale.x;
        this.y = this.scene.scale.displaySize.height - (this.height + this.margin) / this.scene.scale.displayScale.y;

        // filter bar
        this.filterWidth = styles.isMobile ? this.width / 10 : this.width / 20;


        // bg for battleLogWindow
        const bgBox = this.scene.add.rectangle(0,0,this.width,this.height,styles.colors.modernBg, .8).setOrigin(0);
        bgBox.setInteractive();
        bgBox.setStrokeStyle(1, styles.colors.modernBorder);
        bgBox.setName('bgBox');

        // type filter
        // turns, event, text , etc
        const typefilterBtn = this.scene.add.text(this.margin,this.margin,"T", {
            fixedWidth: this.filterWidth,
            fixedHeight: this.filterWidth,
            align: 'center',
            fontSize: this.filterWidth - 18,
            backgroundColor: '#af826b',
            padding: {
                y: 9
            }
        });

        const textHeight = styles.fontSize.default;

        this.maxTexts = (this.height - this.margin * 2)/textHeight;
        const textContainer = this.scene.add.container(this.margin * 2 + this.filterWidth, this.margin);
        textContainer.setName('textContainer');
        for(let i = 0 ; i < this.maxTexts; i++){
            const txt = this.scene.add.text(0, i * textHeight,' ', {fontSize: textHeight - 4});
            textContainer.add(txt);
        }

        this.fixedIndex = false;
        this.startIndex = 0;

        // main container
        this.container = this.scene.add.container(this.x, this.y, [
            bgBox,
            textContainer,
            typefilterBtn,
        ]);


        // scroll factor fucks up pointerOver for childrem without scrollFactor 0
        this.container.setScrollFactor(0, 0, true);
        this.container.setDepth(1);
    }

    setTxtItems(txtItems){
        // all items in list should be texts :)
        // only first txtItems that fit in in this contaier will be shown
        /**
         *
         * @type {Phaser.GameObjects.Container}
         */
        const textContainer = this.container.getByName('textContainer')
        // if(textContainer){
            textContainer.list.map((txt, i) => {
                txt.text = txtItems[i] || '';
            })
        // }
    }

    update(){
        let start;
        let end;

        if(this.fixedIndex){
            start = this.startIndex;
            end = this.startIndex + this.maxTexts;
        } else {
            if(this.battleLog.logs.length <= this.maxTexts){
                this.startIndex = start = 0;
                end = this.maxTexts;
            } else {
                end = this.battleLog.logs.length;
                this.startIndex = start = end - this.maxTexts
            }
        }

        this.setTxtItems(this.battleLog.logs.slice(start, end).map((battleLogItem) => {
            return `[${battleLogItem.timestamp.format('HH:mm:ss')}] ${battleLogItem.text}`;
        }));

        // transform viewport coordinates to game coordinates.
        const targetCoordinates  = new Phaser.Math.Vector2(this.scene.scale.transformX(this.x), this.scene.scale.transformY(this.y));
        // console.log(targetCoordinates);
        // apply to container
        this.container.setPosition(targetCoordinates.x, targetCoordinates.y);

    }

    addEventListenerToBg(event, fn, context) {
        const bg = this.container.getByName('bgBox');
        bg.on(event, fn, context);
    }

    scroll(distance){
        this.fixedIndex = true;
        const lastScrollableIndex = this.battleLog.logs.length - this.maxTexts
        let startIndex = this.startIndex += distance;
        if(startIndex < 0 ){
            startIndex = 0;
        } else if(startIndex > lastScrollableIndex){
            startIndex = lastScrollableIndex
            this.fixedIndex = false;
        }
        this.startIndex = startIndex;
    }
}