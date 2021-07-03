import { randomInt } from "../helpers/randomInt";

export default class BattleInputController{

    /**
     * 
     * @param {Object} props 
     * @param {Phaser.Scene} props.scene 
     */
    constructor(props)
    {
        this.scene = props.scene;
        this.debugger = this.scene.debugger;
        this.cam = this.scene.cameras.main;
        this.maxCameraOffset = 200;
        this.camSpeed = 32;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys('W,A,S,D');

        this.pointerDown;
        this.pointerDownPosition;
        this.pointerDownInitialPosition;
        
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
                

                const tileGridLayer = this.scene.tilemap.getLayer('battleGridLayer');
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

                return;
            } else {
                // if not dragging 
                const tile = this.getTileAtWorldXY(pointer);
                if (tile) {
                    this.hoveredTile = {
                        "tileIndex": tile.index,
                        "tileX": tile.x,
                        "tileY": tile.y,
                    }
                    // const cardIndex = {
                    //     column: Math.floor(tileMapTile.x / 13),
                    //     row: Math.floor(tileMapTile.y / 13)
                    // };
                    this.scene.marker.x = tile.x * this.scene.tileSize;
                    this.scene.marker.y = tile.y * this.scene.tileSize;
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

                this.debugger.displayJson({
                    'x': this.cam.scrollX,
                    'y': this.cam.scrollY
                });

                if (this.pointerDownPosition.x !== this.pointerDownInitialPosition.x
                    || this.pointerDownPosition.y !== this.pointerDownInitialPosition.y) {
                    return;
                }
            }

            const tile = this.getTileAtWorldXY(pointer);
            if (tile) {
                const combatant = this.scene.combatantStatuses[randomInt(this.scene.combatantStatuses.length)];
                if(!tile.properties['cmbId'] && tile.index !== 0){
                    let oldTile = this.getTileAt(combatant.tileCoords.x, combatant.tileCoords.y);
                    oldTile.properties['cmbId'] = false;
                    tile.properties['cmbId'] = combatant.cmbId;
                    combatant.moveToCoords({
                        x: tile.x,
                        y: tile.y
                    });
                }
            }
        });
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
        const tileGridLayer = this.scene.tilemap.getLayer('battleGridLayer');
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

        this.debugger.displayJson({
            'camScrollX': this.cam.scrollX,
            'camScrollY': this.cam.scrollY,
            ...this.hoveredTile,
        });
    }

    getTileAtWorldXY(pointer){
        return this.scene.tilemap.getTileAtWorldXY(pointer.x + pointer.camera.scrollX, pointer.y + pointer.camera.scrollY, false, pointer.camera);
    }

    getTileAt(x,y){
        return this.scene.tilemap.getTileAt(x,y);
    }

    getMaxOffset(tileGridLayer){ 
        const width = tileGridLayer.widthInPixels + this.maxCameraOffset;
        const height = tileGridLayer.heightInPixels + this.maxCameraOffset;

        let x = 0;
        if(width < this.scene.scale.width){
            x = 0;
        } else {
            x = width - this.scene.scale.width;
        }

        let y = 0;
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