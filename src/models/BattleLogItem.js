export default  class BattleLogItem 
{
    constructor(props) {
        this.type = props.type;
        this.text = props.text;
        this.executor = props.executor || null;
        this.action = props.action || null;
    }
}