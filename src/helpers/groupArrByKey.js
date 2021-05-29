/**
 * Groups array of object by key
 * @param {Object[]} arr
 * @param key
 * @return {*}
 */
export const groupArrByKey = (arr, key) => {
    return arr.reduce((r, a) => {
        r[a[key]] = [...r[a[key]] || [], a];
        return r;
    }, {});
}