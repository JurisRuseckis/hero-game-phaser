import {statusOption} from "../ui-components/GridUnit";

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
        this.maxCameraOffset = 200;
        this.cam.scrollX = -this.maxCameraOffset;
        this.cam.scrollY = -this.maxCameraOffset;
        this.camSpeed = 32;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys('W,A,S,D');

        /**
         *
         * @type {GridUnit}
         */
        this.selectedUnit = null;
        
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

                const newPos = {
                    x: this.cam.scrollX + this.pointerDownPosition.x - pointer.x,
                    y: this.cam.scrollY + this.pointerDownPosition.y - pointer.y
                };
                
                const tilemap = this.scene.data.get('tilemap');
                const tileGridLayer = tilemap.getLayer('battleGridLayer');
                // todo: handle smaller arenas than viewport 
                const maxOffset = this.getMaxOffset(tileGridLayer);
                
                
                if(newPos.x < -this.maxCameraOffset ){
                    newPos.x = -this.maxCameraOffset;
                } else if (newPos.x > maxOffset.x){
                    newPos.x = maxOffset.x;
                }
                
                if(newPos.y < -this.maxCameraOffset ){
                    newPos.y = -this.maxCameraOffset;
                } else if (newPos.y > maxOffset.y){
                    newPos.y = maxOffset.y;
                }
    
                this.pointerDownPosition.x = pointer.x;
                this.pointerDownPosition.y = pointer.y;
    
                this.cam.scrollX = newPos.x;
                this.cam.scrollY = newPos.y;
            } else {
                // if not dragging 
                const tile = this.getTileAtWorldXY(pointer);
                if (tile) {
                    const marker = this.scene.data.get('marker');
                    this.hoveredTile = {
                        "tileIndex": tile.index,
                        "tileX": tile.x,
                        "tileY": tile.y,
                    }

                    marker.x = tile.x * this.scene.tileSize;
                    marker.y = tile.y * this.scene.tileSize;
                }
            }           
           
        });
        this.scene.input.on('pointerdown', (pointer) => {
            // screen drag start
            // this.pointerDown = true;
            this.pointerDownPosition = {
                x: pointer.x,
                y: pointer.y,
            };
            this.pointerDownInitialPosition = {...this.pointerDownPosition};
        });
        this.scene.input.on('pointerup', (pointer) => {
            // curently drag feels like workaround and probably will need a rework
            if (this.pointerDown) {
                this.pointerDown = false;

                const debugWindow = this.scene.data.get('debugWindow');

                debugWindow.displayJson({
                    'x': this.cam.scrollX,
                    'y': this.cam.scrollY
                });

                if (this.pointerDownPosition.x !== this.pointerDownInitialPosition.x
                    || this.pointerDownPosition.y !== this.pointerDownInitialPosition.y) {
                    return;
                }
            }

            /**
             * @type {Phaser.Tilemaps.Tile}
             */
            const tile = this.getTileAtWorldXY(pointer);
            if (tile) {
                if(tile.properties['cmbId']){
                    const gridUnits = this.scene.data.get('gridUnits');
                    this.selectedUnit = gridUnits.find(c => c.cmbId === tile.properties['cmbId']) || null;
                    if(this.selectedUnit){
                        this.selectedUnit.setStyle(statusOption.selected);
                    }
                }
            }
        });
        // noinspection JSUnusedLocalSymbols
        this.scene.input.on('wheel', function(pointer, currentlyOver, dx, dy, dz, event){
            const cam = this.cameras.main;
            let newZoom = cam.zoom - dy/1000;
            if(newZoom < 0.6){
                newZoom = 0.6;
            } else if(newZoom > 1.2){
                newZoom = 1.2;
            }
            cam.setZoom(newZoom);
        });
    }

    checkBtns() {
        const tilemap = this.scene.data.get('tilemap');
        const tileGridLayer = tilemap.getLayer('battleGridLayer');
        const maxOffset = this.getMaxOffset(tileGridLayer);
        // let updateDebugger = false;

        if (this.keys.A.isDown || this.cursors.left.isDown) {
            this.cam.scrollX -= this.camSpeed;
            if(this.cam.scrollX < -this.maxCameraOffset){
                this.cam.scrollX = -this.maxCameraOffset;
            }
            // updateDebugger = true;
        } else if (this.keys.D.isDown || this.cursors.right.isDown) {
            this.cam.scrollX += this.camSpeed;
            if(this.cam.scrollX > maxOffset.x){
                this.cam.scrollX = maxOffset.x;
            }
            // updateDebugger = true;
        }
    
        if (this.keys.W.isDown || this.cursors.up.isDown) {
            this.cam.scrollY -= this.camSpeed;
            if(this.cam.scrollY < -this.maxCameraOffset){
                this.cam.scrollY = -this.maxCameraOffset;
            }
            // updateDebugger = true;
        } else if (this.keys.S.isDown || this.cursors.down.isDown) {
            this.cam.scrollY += this.camSpeed;
            if(this.cam.scrollY > maxOffset.y){
                this.cam.scrollY = maxOffset.y;
            }
            // updateDebugger = true;
        }

        const debugWindow = this.scene.data.get('debugWindow');
        debugWindow.displayJson({
            'camScrollX': this.cam.scrollX,
            'camScrollY': this.cam.scrollY,
            ...this.hoveredTile,
            'selectedUnit': this.selectedUnit ? this.selectedUnit.cmbId : null
        });
    }

    getTileAtWorldXY(pointer){
        const tilemap = this.scene.data.get('tilemap');
        return tilemap.getTileAtWorldXY(pointer.x + pointer.camera.scrollX, pointer.y + pointer.camera.scrollY, false, pointer.camera);
    }

    getTileAt(x,y){
        const tilemap = this.scene.data.get('tilemap');
        return tilemap.getTileAt(x,y);
    }

    getMaxOffset(tileGridLayer){ 
        const width = tileGridLayer.widthInPixels + this.maxCameraOffset;
        const height = tileGridLayer.heightInPixels + this.maxCameraOffset;

        let x;
        if(width < this.scene.scale.width){
            x = 0;
        } else {
            x = width - this.scene.scale.width;
        }

        let y;
        if(height < this.scene.scale.height){
            y = 0;
        } else {
            y = height - this.scene.scale.height;
        }
        
        
        return {
            x:x,
            y:y,
        }
    }
}