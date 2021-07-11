export default class BattleInputController{

    /**
     * 
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     */
    constructor(props)
    {
        this.scene = props.scene;
        this.cam = this.scene.cameras.main;

        this.maxCameraOffset = this.getMaxOffset();
        // will need to make this work sometime
        this.cam.setBounds(
            this.maxCameraOffset.min.x,
            this.maxCameraOffset.min.y,
            this.maxCameraOffset.width,
            this.maxCameraOffset.height,
        );

        this.cam.scrollX = this.maxCameraOffset.min.x;
        this.cam.scrollY = this.maxCameraOffset.min.y;
        this.camSpeed = 32;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys('W,A,S,D');
        
        this.hoveredTile = {
            "tileIndex": '',
            "tileX": '',
            "tileY": '',
        };

        this.addEvents();
    }

    addEvents() {
        this.scene.input.on('pointermove', (pointer) => {
            // handle screen drag
            // curently drag feels like workaround and probably will need a rework
            // there must be a way to handle this in phaser
            if (this.pointerDown) {
                const dragDistance = this.getDragDistance(pointer);
                this.moveCamera(dragDistance);
                this.pointerDownPosition.x = pointer.x;
                this.pointerDownPosition.y = pointer.y;
            } else {
                // if not dragging 
                const tile = this.getTileAtWorldXY(pointer);
                const battle = this.scene.data.get('battle');
                if (tile) {
                    const marker = this.scene.data.get('marker');

                    this.hoveredTile = {
                        'tileIndex': tile.index,
                        'tileX': tile.x,
                        'tileY': tile.y,
                        'tileProperties': tile.properties,
                    }

                    if(tile.properties['cmbId']){
                        const cmbObj = battle.getCombatants().find(c => c.id === tile.properties['cmbId']);
                        if(cmbObj){
                            this.hoveredTile.combatant = cmbObj.print();
                        } else {
                            this.hoveredTile.combatant = 'probably MIA!';
                        }
                    }

                    if(tile.properties['corpses']){
                        this.hoveredTile.corpses = tile.properties['corpses'].map((combatantCorpse) => {
                            const cmbObj = battle.corpses.find(c => c.id === combatantCorpse);
                            if(cmbObj){
                                return cmbObj.print();
                            } else {
                                return 'probably MIA! wtf?';
                            }
                        })
                    }


                    marker.x = tile.x * this.scene.tileSize;
                    marker.y = tile.y * this.scene.tileSize;
                }
            }           
           
        });
        this.scene.input.on('pointerdown', (pointer) => {
            // screen drag start
            this.pointerDown = true;
            this.pointerDownPosition = {
                x: pointer.x,
                y: pointer.y,
            };
        });
        this.scene.input.on('pointerup', (pointer) => {
            // curently drag feels like workaround and probably will need a rework
            if (this.pointerDown) {
                this.pointerDown = false;
            }
        });
        // noinspection JSUnusedLocalSymbols
        this.scene.input.on('wheel', function(pointer, currentlyOver, dx, dy, dz, event){
            let newZoom = this.cam.zoom - dy/1000;
            if(newZoom < 0.8){
                newZoom = 0.8;
            } else if(newZoom > 1.2){
                newZoom = 1.2;
            }
            this.cam.setZoom(newZoom);

            this.maxCameraOffset = this.getMaxOffset();
            // will need to make this work sometime
            this.cam.setBounds(
                this.maxCameraOffset.min.x,
                this.maxCameraOffset.min.y,
                this.maxCameraOffset.width,
                this.maxCameraOffset.height,
            );
        },this);
    }

    checkBtns() {
        if (this.keys.A.isDown || this.cursors.left.isDown) {
            this.moveCamera(new Phaser.Math.Vector2(-this.camSpeed, 0));
        } else if (this.keys.D.isDown || this.cursors.right.isDown) {
            this.moveCamera(new Phaser.Math.Vector2(this.camSpeed, 0));
        }
    
        if (this.keys.W.isDown || this.cursors.up.isDown) {
            this.moveCamera(new Phaser.Math.Vector2(0, -this.camSpeed));
        } else if (this.keys.S.isDown || this.cursors.down.isDown) {
            this.moveCamera(new Phaser.Math.Vector2(0, this.camSpeed));
        }

        const debugWindow = this.scene.data.get('debugWindow');
        debugWindow.displayJson({
            'camScrollX': this.cam.scrollX,
            'camScrollY': this.cam.scrollY,
            ...this.hoveredTile,
        });
    }

    getTileAtWorldXY(pointer){
        const tilemap = this.scene.data.get('tilemap');
        return tilemap.getTileAtWorldXY(
            pointer.worldX,
            pointer.worldY,
            false,
            pointer.camera
        );
    }

    getTileAt(x,y){
        const tilemap = this.scene.data.get('tilemap');
        return tilemap.getTileAt(x,y);
    }

    getMaxOffset(){

        const tilemap = this.scene.data.get('tilemap');
        const tileGridLayer = tilemap.getLayer('battleGridLayer');

        const defaultOffset = 200;
        const width = (tileGridLayer.widthInPixels + defaultOffset * 2) * this.cam.zoomX;
        const height = (tileGridLayer.heightInPixels + defaultOffset * 2) * this.cam.zoomY;
        const diff = new Phaser.Math.Vector2(width - this.scene.scale.width, height - this.scene.scale.height)

        let maxX;
        let minX;
        if(diff.x < 0){
            minX = maxX = diff.x/2;
        } else {
            minX = -defaultOffset;
            maxX = diff.x;
        }

        let minY = -defaultOffset;
        let maxY;
        if(diff.y < 0 ){
            maxY = -defaultOffset;
        } else {
            maxY = diff.y;
        }

        return {
            min: new Phaser.Math.Vector2(minX, minY),
            max: new Phaser.Math.Vector2(maxX, maxY),
            width: width,
            height: height
        }
    }

    /**
     *
     * @param {Phaser.Input.Pointer} pointer
     * @return {Phaser.Math.Vector2}
     */
    getDragDistance(pointer){
        return new Phaser.Math.Vector2(this.pointerDownPosition.x - pointer.x, this.pointerDownPosition.y - pointer.y);
    }

    /**
     *
     * @param {Phaser.Math.Vector2} distance
     */
    moveCamera(distance){
        this.cam.setScroll(this.cam.scrollX + distance.x, this.cam.scrollY + distance.y)
    }
}