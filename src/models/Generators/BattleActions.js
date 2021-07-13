import CombatAction, {actionTags} from "../CombatAction";
import Phaser from "phaser";

/**
 * Default action that each characters will have
 * @type {Object}
 */
export const defaultActions = {
    wait: new CombatAction({
        key: 'wait',
        tags: [actionTags.any],
        range: 2,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            return `${executor.label} from team ${executor.team} waits`;
        },
        targetRules: (executor, target, arena) => {
            return true;
        }
    }),
    walk:  new CombatAction({
        key: 'walk',
        tags: [actionTags.any],
        range: 5,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            const init = new Phaser.Math.Vector2(executor.coordinates.x, executor.coordinates.y);
            executor.coordinates.set(target.tile.x, target.tile.y);
            return `${executor.label} from team ${executor.team} walks from tile at [${init.x},${init.y}] to tile at [${target.tile.x},${target.tile.y}]`;
        },
        targetRules: (executor, target, arena) => {
            return !target.tile.properties['cmbId']
                && target.tile.index !== 0
                && target.tile.x !== executor.coordinates.x
                && target.tile.y !== executor.coordinates.y
        }
    }),
    attack: new CombatAction({
        key: 'attack',
        tags: [actionTags.targetable],
        range: 1,
        cooldown: 0,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            const dmg = executor.calculateDmg();
            target.combatant.hp -= dmg;
            return `${executor.label} from team ${executor.team} attacks ${target.combatant.label} from team ${target.combatant.team} for ${dmg} damage!`;
        },
        targetRules: (executor, target, arena) => {
            return executor.team !== target.combatant.team;
        }
    })
};

/**
 * @type {Object}
 */
export const actionPool = {
    heal : new CombatAction({
        key: 'heal',
        tags: [actionTags.targetable],
        range: 2,
        cooldown: 20,
        operation: (executor, target, arena) => {
            executor.turnMeter = 0;
            const healAmount = executor.calculateDmg();
            target.combatant.hp += healAmount;
            if(target.combatant.hp > target.combatant.maxHp){
                target.combatant.hp = target.combatant.maxHp;
            }
            return `${executor.label} from team ${executor.team} heals ${target.combatant.label} from team ${target.combatant.team} for ${healAmount} hp!`;
        },
        targetRules: (executor, target, arena) => {
            console.log(target)
            return executor.team === target.combatant.team;
        }
    }),
}