export default class BattleCameraController{

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

                const tileGridLayer = this.scene.map.getLayer('tileGridLayer');
                const maxXOffset = tileGridLayer.width + this.maxCameraOffset - this.scene.scale.width;
                
                
                if(newPos.x < -this.maxCameraOffset ){
                    newPos.x = -this.maxCameraOffset;
                } else if (newPos.x > maxXOffset){
                    newPos.x = maxXOffset;
                }
                
                const maxYOffset = tileGridLayer.heightInPixels + this.maxCameraOffset - this.scene.scale.height;
                if(newPos.y < -this.maxCameraOffset ){
                    newPos.y = -this.maxCameraOffset;
                } else if (newPos.y > maxYOffset){
                    newPos.y = maxYOffset;
                }
    
                this.pointerDownPosition.x = pointer.x;
                this.pointerDownPosition.y = pointer.y;
    
                this.cam.scrollX = newPos.x;
                this.cam.scrollY = newPos.y;

                return;
            }           
           
        });
        this.scene.input.on('pointerdown', (pointer) => {
            // screen drag start
            this.pointerDown = true;
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
        });
        this.scene.input.on('wheel', function(pointer, currentlyOver, dx, dy, dz, event){
            const cam = this.cameras.main;
            cam.setZoom(cam.zoom - dy/1000);
        
        });
    }

    checkBtns() {
        const tileGridLayer = this.scene.map.getLayer('tileGridLayer');
        const maxXOffset = tileGridLayer.width + this.maxCameraOffset - this.scene.scale.width;
        const maxYOffset = tileGridLayer.heightInPixels + this.maxCameraOffset - this.scene.scale.height;
        let updateDebugger = false;

        if (this.keys.A.isDown || this.cursors.left.isDown) {
            this.cam.scrollX -= this.camSpeed;
            if(this.cam.scrollX < -this.maxCameraOffset){
                this.cam.scrollX = -this.maxCameraOffset;
            }
            updateDebugger = true;
        } else if (this.keys.D.isDown || this.cursors.right.isDown) {
            this.cam.scrollX += this.camSpeed;
            if(this.cam.scrollX > maxXOffset){
                this.cam.scrollX = maxXOffset;
            }
            updateDebugger = true;
        }
    
        if (this.keys.W.isDown || this.cursors.up.isDown) {
            this.cam.scrollY -= this.camSpeed;
            if(this.cam.scrollY < -this.maxCameraOffset){
                this.cam.scrollY = -this.maxCameraOffset;
            }
            updateDebugger = true;
        } else if (this.keys.S.isDown || this.cursors.down.isDown) {
            this.cam.scrollY += this.camSpeed;
            if(this.cam.scrollY > maxYOffset){
                this.cam.scrollY = maxYOffset;
            }
            updateDebugger = true;
        }

        if(updateDebugger){
            this.debugger.displayJson({
                'x': this.cam.scrollX,
                'y': this.cam.scrollY
            });
        }
    }
}