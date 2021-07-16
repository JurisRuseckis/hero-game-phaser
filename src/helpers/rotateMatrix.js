import {getAngleDiffShort} from "./getAngleDiffShort";

export const rotateMatrix = (matrix, from, to) => {
    //probably will need to optimize this part
    let angleDiff = getAngleDiffShort(from,to);
    angleDiff = Math.round(angleDiff/90)*90;

    switch (angleDiff){
        case 90:
            //transpose and reverse columns
            return matrix[0].map((c,i) => matrix.map(b => b[i])).reverse();
        case -90:
            //transpose & reverse rows
            return matrix[0].map((c,i) => matrix.map(b => b[i])).map(d => d.reverse());
        case -180:
        case 180:
            // reverse rows then columns
            return matrix.map(b => b.reverse()).reverse();
        default:
            return matrix;
    }
}