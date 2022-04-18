import {styles} from "../styles";
import Btn from "../ui-components/Btn";

export default class CampSceneGrid
{
    /**
     * 
     * @param {*} props 
     * @param {Phaser.Scene} props.scene
     * @param {number} props.alignment
     * @param {Object} props.levels
     */
    constructor(props) {
        this.scene = props.scene;
        this.levels = props.levels;

        this.width = styles.grid.window;
        this.height = styles.panelLayout.contentHeight;
        this.columns = 6
        this.slotSize = (this.width - styles.padding * (1 + this.columns)) / this.columns

        this.cont = this.createWindow(props.alignment);
        this.cont.layout();

        this.cont.getByName('scrollPanel').setChildrenInteractive({
            targets:[
                ...this.levels.map((level) => {
                    return this.cont.getByName(level.key, true);
                })
            ]
        })
            .on('child.over', function (child) {
                child.getByName(`btn-${child.searchKey}`).setFillStyle(styles.colors.modernBorder)
            })
            .on('child.out', function (child) {
                child.getByName(`btn-${child.searchKey}`).setFillStyle(styles.colors.modernBtn)
            })
            .on('child.click', function (child) {
                child.onclickfn();
            })
    }

    createWindow(anchor){
        const bg = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
            .setFillStyle(styles.colors.modernBg, .8)
            .setStrokeStyle(1, styles.colors.modernBorder, 1);

        const label = this.scene.rexUI.add.label({
            orientation: 'y',
            text: this.scene.add.text(0, 0, 'Battle',{
                fontSize: styles.fontSize.title,
                color: styles.textColors.white
            })
        });

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
            .add(label, { expand: true, align: 'left' })
            .add(this.createScrollablePanel(), { expand: true, align: 'left' })
            .setName('campSceneWindow');
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
                child:  this.createTableList(),

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

    createTableList(){
        this.listItemWidth = this.width - 20 - styles.padding * 3;

        this.tableList = this.scene.rexUI.add.sizer({
            width: this.listItemWidth,
            orientation: 'v',
            space: {item: styles.padding / 2},
            name: 'tableList'
        })

        this.levels.forEach((level)=>{
            this.tableList.add(this.createTable(level), {expand:true, align:'left'})
        })

        return this.tableList;
    }

    createTable(data){
        const title = this.scene.rexUI.add.label({
            orientation: 'y',
            background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined)
                .setFillStyle(styles.colors.modernBtn, .8)
                .setStrokeStyle(1, styles.colors.modernBorder, 1),
            text: this.scene.add.text(0, 0, data.title, {fontSize: styles.fontSize.large}),
        });

        const columns = this.columns;
        const rows = Math.ceil(data.items.length/columns)

        const table = this.scene.rexUI.add.gridSizer({
            column: columns,
            row: rows,
            height: rows * this.slotSize,

            rowProportions: 1,
            // columnProportions: 1,
            space: { column: styles.padding, row: styles.padding },
            name: data.key  // Search this name to get table back
        });

        data.items.forEach((item, index) => {
            const column = index % columns;
            const row = (index - column) / columns;
            
            table.add(this.createSlot(index+1,item),{
                column: column,
                row: row,
                align: 'center',
                padding: {left: 0, right: 0, top: 0, bottom: 0},
                expand: false
            });
        });

        return this.scene.rexUI.add.sizer({
            orientation: 'y',
            space: { 
                left: styles.padding, 
                right: styles.padding, 
                top: styles.padding, 
                bottom: styles.padding, 
                item: styles.padding 
            }
        })
            .add(title,{ expand: true, align: 'left' })
            .add(table, { expand: true, align: 'left' });
    }

    createSlot(title, data){
        // TODO: remake all ui components someday
        const btn = new Btn({
            scene: this.scene,
            x: 0,
            y: 0,
            width: this.slotSize,
            height: this.slotSize,
            text: title,
            textStyle: {fontSize: styles.fontSize.large},
            ornament: data.completed ? "✓" : undefined
        });
        btn.container.searchKey = btn.key;
        btn.container.onclickfn = data.onClick;
        // manually fixing offsets to implement with rexui
        btn.btnObj.setOrigin(0.5);
        btn.txtObj.setPosition(0,0,0,0);
        if(btn.ornament){
            btn.ornament.setPosition(0,0,0,0);
        }
        return btn.container;
    }

}