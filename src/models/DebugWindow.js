export default class DebugWindow
{
    /**
     * 
     * @param {*} props 
     * @param {Phaser.Scene} props.scene
     * @param {number} props.x
     * @param {number} props.y
     */
    constructor(props) {
        this.text = '';
        this.scene = props.scene;
        this.update = false;

        this.obj = this.scene.add.text(props.x || 16 , props.y || 16, this.text, {
            fontSize: '18px',
            padding: {x: 10, y: 5},
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        this.obj.setScrollFactor(0);
        this.obj.setName('debug');
        this.obj.setDepth(1);

    }

    displayJson(json) {
        json = json ? json : 'undefined';
        this.text = 'Debug Text: ' + JSON.stringify(json, null, '\t');
        this.update = true;
    }

    setText(text){
        this.text = text;
        this.update = true;
    }

    redraw(){
        
        this.obj.setText(this.text);
    }
}