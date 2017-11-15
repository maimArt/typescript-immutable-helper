/**
 * freezes an object recursively
 * @param {T} object object child freeze
 * @returns {T} frozen object
 */
export function deepFreeze<T>(object: T): T {
    Object.freeze(object);

    // skip deep freezing of non objects and functions
    if (typeof object !== 'object') {
        return object
    }

    Object.getOwnPropertyNames(object)
        .filter((prop) => object[prop] !== null && !Object.isFrozen(object[prop]))
        .forEach((prop) => deepFreeze(object[prop]))

    return object
}

/**
 * checks if object is deep frozen with {@link deepFreeze]
 * @param object
 * @returns {boolean}
 */
export function isDeepFrozen(object): boolean {
    if (Object.isFrozen(object)) {
        // skip deep testing of non objects and functions
        if (typeof object !== 'object') {
            return true
        }

        return Object.getOwnPropertyNames(object)
        // only objects, no functions
            .filter((prop) => object[prop] !== null && typeof object === 'object')
            .every((prop) => isDeepFrozen(object[prop]))
    } else {
        return false
    }
}