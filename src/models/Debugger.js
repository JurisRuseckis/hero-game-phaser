export default class Debugger
{
    constructor(props) {
        this.text = '';
        this.scene = props.scene;

        this.obj = this.scene.add.text(16, 16, this.text, {
            fontSize: '18px',
            padding: {x: 10, y: 5},
            backgroundColor: '#000000',
            fill: '#ffffff'
        });
        this.obj.setScrollFactor(0);

    }

    displayJson(json) {
        json = json ? json : 'undefined';
        this.text = 'Debug Text: ' + JSON.stringify(json, null, '\t');
        this.update();
    }

    update(){
        this.obj.setText(this.text);
    }
}