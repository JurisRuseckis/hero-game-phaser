import BattleLogItem from "./BattleLogItem";

export const battleLogType = {
    text: 0,
    turn: 1,
};

export default class BattleLog
{
    constructor(props) {
        this.logs = [];
    }

    addText(text){
        this.logs.push(new BattleLogItem({
            type: battleLogType.text,
            text: text
        }));
    }

    addTurn(text, executor, action){
        this.logs.push(new BattleLogItem({
            type: battleLogType.turn,
            text: text,
            executor: executor,
            action: action,
        }));
    }

    getLastOfType(type){
        const turns = this.logs.filter((l)=>l.type === type);
        return turns[turns.length - 1];
    }

    print(){
        return this.logs.map((log, index)=>{
            return `Log ${index+1}: ${log.text}`;
        })
    } 
}