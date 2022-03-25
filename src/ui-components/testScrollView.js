import {styles} from "../styles";

class TestScrollView {
    createScrollableView(){
        const data = {
            name: 'Rex',
            skills: [
                { name: 'A' },
                { name: 'B' },
                { name: 'C' },
                { name: 'D' },
                { name: 'E' },
            ],
            items: [
                { name: 'A' },
                { name: 'B' },
                { name: 'C' },
                { name: 'D' },
                { name: 'E' },
                { name: 'F' },
                { name: 'G' },
                { name: 'H' },
                { name: 'I' },
                { name: 'J' },
                { name: 'K' },
                { name: 'L' },
                { name: 'M' },
            ],

        };

        const scrollablePanel = this.rexUI.add.scrollablePanel({
            x: styles.viewPort.centerX,
            y: styles.viewPort.centerY,
            width: 600,
            height: 440,

            scrollMode: 'v',

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: this.createPanel(data),

                mask: {
                    padding: 1,
                    // layer: this.add.layer()
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, styles.colors.modernBorder),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, styles.colors.modernBtn),
            },

            // scroller: true,
            scroller: {
                // pointerOutRelease: false
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            }
        })
            .layout()

        const print = this.add.text(0, 0, '');
        scrollablePanel.setChildrenInteractive({
            targets: [
                scrollablePanel.getByName('skills', true),
                scrollablePanel.getByName('items', true)
            ]
        })
            .on('child.click', function (child) {
                const category = child.getParentSizer().name;
                print.text += `${category}:${child.text}\n`;
            })
    }

    createPanel(data) {
        return this.rexUI.add.sizer({
            orientation: 'v',
            space: {item: 10}
        })
            .add(
                this.createHeader(data), // child
                {expand: true}
            )
            .add(
                this.createTable(data, 'skills', 1), // child
                {expand: true}
            )
            .add(
                this.createTable(data, 'items', 2), // child
                {expand: true}
            );
    }
    createHeader(data){
        const title = this.rexUI.add.label({
            orientation: 'x',
            text: this.add.text(0, 0, 'Character'),
        });
        const header = this.rexUI.add.label({
            orientation: 'y',
            icon: this.rexUI.add.roundRectangle(0, 0, 100, 100, 5, COLOR_LIGHT),
            text: this.add.text(0, 0, data.name),

            space: { icon: 10 }
        });

        return this.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }
        })
            .addBackground(
                this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
            )
            .add(
                title, // child
                { expand: true, align: 'left' }
            )
            .add(header, // child
                { proportion: 1, expand: true }
            );
    }
    createTable(data, key, rows){
        const capKey = key.charAt(0).toUpperCase() + key.slice(1);
        const title = this.rexUI.add.label({
            orientation: 'x',
            text: this.add.text(0, 0, capKey),
        });

        const items = data[key];
        const columns = Math.ceil(items.length / rows);
        const table = this.rexUI.add.gridSizer({
            column: columns,
            row: rows,
            height: 200,

            rowProportions: 1,
            // columnProportions: 1,
            space: { column: 10, row: 10 },
            name: key  // Search this name to get table back
        });

        let item, r, c;
        const iconSize = (rows === 1) ? 80 : 40;
        for (let i = 0, cnt = items.length; i < cnt; i++) {
            item = items[i];
            r = i % rows;
            c = (i - r) / rows;
            table.add(
                this.createIcon(item, iconSize, iconSize),
                c,
                r,
                'top',
                0,
                true
            );
        }

        return this.rexUI.add.sizer({
            orientation: 'y',
            space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 }
        })
            .addBackground(
                this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
            )
            .add(
                title, // child
                0, // proportion
                'left', // align
                0, // paddingConfig
                true // expand
            )
            .add(table, // child
                1, // proportion
                'center', // align
                0, // paddingConfig
                true // expand
            );
    }
    createIcon(item, iconWidth, iconHeight){
        const icon = this.rexUI.add.label({
            orientation: 'y',
            icon: this.rexUI.add.roundRectangle(0, 0, iconWidth, iconHeight, 5, COLOR_LIGHT),
            text: this.add.text(0, 0, item.name),

            space: {icon: 3}
        });
        return icon;
    }
}