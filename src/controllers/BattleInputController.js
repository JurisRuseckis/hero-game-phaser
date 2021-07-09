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

        console.log(this.maxCameraOffset);
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

                // if (this.pointerDownPosition.x !== this.pointerDownInitialPosition.x
                //     || this.pointerDownPosition.y !== this.pointerDownInitialPosition.y) {
                //     return;
                // }
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
        const maxOffset = this.getMaxOffset();
        // let updateDebugger = false;

        if (this.keys.A.isDown || this.cursors.left.isDown) {
            this.cam.scrollX -= this.camSpeed;
            if(this.cam.scrollX < maxOffset.min.x){
                this.cam.scrollX = maxOffset.min.x;
            }
            // updateDebugger = true;
        } else if (this.keys.D.isDown || this.cursors.right.isDown) {
            this.cam.scrollX += this.camSpeed;
            if(this.cam.scrollX > maxOffset.max.x){
                this.cam.scrollX = maxOffset.max.x;
            }
            // updateDebugger = true;
        }
    
        if (this.keys.W.isDown || this.cursors.up.isDown) {
            this.cam.scrollY -= this.camSpeed;
            if(this.cam.scrollY < maxOffset.min.y){
                this.cam.scrollY = maxOffset.min.y;
            }
            // updateDebugger = true;
        } else if (this.keys.S.isDown || this.cursors.down.isDown) {
            this.cam.scrollY += this.camSpeed;
            if(this.cam.scrollY > maxOffset.max.y){
                this.cam.scrollY = maxOffset.max.y;
            }
            // updateDebugger = true;
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
        return tilemap.getTileAtWorldXY(pointer.x + pointer.camera.scrollX, pointer.y + pointer.camera.scrollY, false, pointer.camera);
    }

    getTileAt(x,y){
        const tilemap = this.scene.data.get('tilemap');
        return tilemap.getTileAt(x,y);
    }

    getMaxOffset(){

        const tilemap = this.scene.data.get('tilemap');
        const tileGridLayer = tilemap.getLayer('battleGridLayer');

        const defaultOffset = 200;
        const width = tileGridLayer.widthInPixels + defaultOffset;
        const height = tileGridLayer.heightInPixels + defaultOffset;
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
}