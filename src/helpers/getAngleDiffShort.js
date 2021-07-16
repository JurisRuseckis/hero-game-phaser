import Phaser from "phaser";

/**
 * Returns angle diff 
 * @param {Phaser.Math.Vector2} from
 * @param {Phaser.Math.Vector2} to
 */
export const getAngleDiffShort = (from, to) => {
    const angleDiff = Phaser.Math.RadToDeg(from.angle() - to.angle());
    if(angleDiff >= 180){
        return 180 - angleDiff;
    }
    if ( angleDiff <= -180){
        return  -(180 + angleDiff);
    }
    return angleDiff;
}