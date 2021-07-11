export default class BattleInputController{

    /**
     * 
     * @param {Object} props
     * @param {Phaser.Scene} props.scene
     */
    constructor(props)
    {
        this.scene = props.scene;
        this.enableScroll = false;
        this.addEvents();
    }

    addEvents() {
        const battleLogWindow = this.scene.data.get('battleLogWindow');
        battleLogWindow.addEventListenerToBg('pointerover', () => {
            this.enableScroll = true;
        }, this);
        battleLogWindow.addEventListenerToBg('pointerout', () => {
            this.enableScroll = false;
        }, this);

        this.scene.input.on('pointermove', (pointer) => {
            // handle screen drag
            // curently drag feels like workaround and probably will need a rework
            // there must be a way to handle this in phaser
            if (this.pointerDown) {
                const dragDistance = this.getDragDistance(pointer);
                battleLogWindow.scroll(Math.floor(dragDistance.y/2));
                this.pointerDownPosition.x = pointer.x;
                this.pointerDownPosition.y = pointer.y;

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

        this.scene.input.on('wheel', function(pointer, currentlyOver, dx, dy, dz, event){
            if(this.enableScroll){
                battleLogWindow.scroll(dy/10);
            }
        }, this);
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