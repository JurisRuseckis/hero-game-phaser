// Similar to JSON.stringify but limited to a specified depth (default 1)
export const stringify = (obj, replacer, space, depth, lvl = 0) => {
    if (depth === undefined) {
        depth = 1 // default
    }

    const indent = ' '.repeat(lvl);

    return ( ! obj)
        ? JSON.stringify(obj, replacer, space)
        : (typeof obj === 'object')
            ? `{\n`
            + (depth < 1
                ? `${indent}...`
                : ( Object
                        .keys(obj)
                        .map((k) => `${indent}${k}: ${stringify(obj[k], replacer, space, depth - 1, lvl + 1)}`)
                        .join(`,\n`)
                    )
            )
            + `\n${indent}}`
            : JSON.stringify(obj, replacer, space)
}