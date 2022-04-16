import {styles} from "../styles";
import {teamTextColors} from "../battle-grid-components/GridUnit";

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
        this.logCount = 0;

        this.width = styles.isMobile ? styles.grid.window : (styles.viewPort.width - 2 * styles.padding) * 0.666;
        this.height = styles.isMobile ? styles.grid.window * 0.2 : styles.viewPort.width * 0.2;

        this.cont = this.createWindow(props.alignment);
        this.cont.layout();

        this.logListWidth = this.logList.width;
    }

    createWindow(anchor) {
        const bg = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
            .setFillStyle(styles.colors.modernBg, .8)
            .setStrokeStyle(1, styles.colors.modernBorder, 1);

        return this.scene.rexUI.add.sizer({
            anchor: anchor,
            width: this.width,
            height: this.height,
            orientation: 'v',
            space: {
                left: styles.padding,
                right: styles.padding,
                top: styles.padding,
                bottom: styles.padding,
                item: 0,
            }
        })
            .addBackground(bg)
            .add(this.createScrollablePanel(), { expand: true, align: 'left' })
            .setName('battleLogWindow')
    }

    createScrollablePanel(){

        const scrollPanel = this.scene.rexUI.add.scrollablePanel({
            name: 'scrollPanel',
            x: 0,
            y: 0,
            width: this.width - 2*styles.padding,
            height: this.height - 2*styles.padding,

            scrollMode: 'v',

            panel: {
                child:  this.createLogList(),

                mask: {
                    padding: 1,
                },
            },

            slider: {
                track: this.scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, styles.colors.modernBorder),
                thumb: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, styles.colors.modernBtn),
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                panel: styles.padding,
            }
        });

        return scrollPanel;
    }

    createLogList(){
        this.listItemWidth = this.width - 20 - styles.padding * 3;

        this.logList = this.scene.rexUI.add.sizer({
            width: this.listItemWidth,
            orientation: 'v',
            space: {item: styles.padding / 2},
            name: 'logList'
        })

        return this.logList;
    }

    createLogListItems(items){
        items.forEach((item) => {
            const textColor = item.color 
                ? item.color
                : styles.textColors.white

            this.logList.add(this.scene.add.text(0,0,item.text,{
                fontSize: styles.fontSize.default, 
                wordWrap: { width: this.logListWidth }, 
                color: textColor
            }),{expand:false, align:'left'});
        })

        this.cont.layout();
        
    }

    update(){
        const newLogCount = this.battleLog.logs.length - this.logCount;

        if(newLogCount > 0){
            this.createLogListItems(this.battleLog.logs.slice(this.logCount, this.battleLog.logs.length).map((battleLogItem) => {
                return {
                    text : `[${battleLogItem.timestamp.format('HH:mm:ss')}] ${battleLogItem.text}`,
                    color : battleLogItem.executor ? teamTextColors[battleLogItem.executor.team] : this.textColor
                };
            }));
            this.logCount = this.battleLog.logs.length;
        }
    }
}