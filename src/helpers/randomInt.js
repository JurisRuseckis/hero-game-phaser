/**
 * Gets random number that [0;max]
 * @param {number} max
 * @param {number} min=0
 * @return {number}
 */
export const randomInt = (max, min = 0) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}