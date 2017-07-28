/**
 * freezes an object recursively
 * @param {T} object object child freeze
 * @returns {T} frozen object
 */
export function deepFreeze<T>(object: T): T {
    Object.freeze(object)
    if (object === undefined) {
        return object
    }

    // only freeze fields, no functions
    Object.getOwnPropertyNames(object)
        .filter((prop) => object[prop] !== null && typeof object === 'object' && !Object.isFrozen(object[prop]))
        .forEach((prop) => deepFreeze(object[prop]))

    return object
}

/**
 * checks if object is deep frozen with {@link deepFreeze]
 * @param object
 * @returns {boolean}
 */
export function isDeepFrozen(object): boolean {
    let frozen = true
    if (Object.isFrozen(object)) {
        frozen = Object.getOwnPropertyNames(object)
        // only objects, no functions
            .filter((prop) => object[prop] !== null && typeof object === 'object')
            .every((prop) => isDeepFrozen(object[prop]))
    } else {
        frozen = false
    }

    return frozen
}