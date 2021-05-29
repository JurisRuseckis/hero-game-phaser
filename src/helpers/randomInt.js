/**
 * Gets random number that [0;max]
 * @param {number} max
 * @return {number}
 */
export const randomInt = (max) => {
    console.log(max);
    return Math.floor(Math.random() * max);
}