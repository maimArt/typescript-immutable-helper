import * as _ from 'lodash'
import {deepFreeze, isDeepFrozen} from './deepFreeze'

/**
 * Class that helps to replicate a new object by encapsulating a deep copy of the source object
 * If input object is frozen by (@link Object.freeze()} or {@link deepFreeze} then the replica will be produced frozen
 * freeze in --> deep freeze out
 * Warns if source object is just frozen, not deep frozen
 **/
export class ReplicationBuilder<T> {
    private replica: T = null
    private freeze = false

    /**
     * default constructor
     * @param {RT} sourceObject traversing object
     */
    private constructor(sourceObject: T) {
        this.replica = _.cloneDeep(sourceObject)
        this.freeze = Object.isFrozen(sourceObject)
        if (this.freeze && !isDeepFrozen(sourceObject)) {
            console.warn('Source object is frozen but not deep frozen. Please care that always deepFreeze() is used to recursively freeze the object')
        }
    }

    public static forObject<T>(sourceObject: T): ReplicationBuilder<T> {
        return new ReplicationBuilder<T>(sourceObject)
    }

    /** switch to child node
     * @param {K} childNode of the root node
     * @returns {ReplicaChildOperator<T, T[K]>} operator of child node
     **/
    public getChild<K extends keyof T>(childNode: K): ReplicaChildOperator<T, T[K]> {
        let node = this.replica[childNode]
        return new ReplicaChildOperator((() => this.build()), this.replica, node, childNode)
    }

    modify<K extends keyof T>(childNode: K): PropertyModifier<ReplicationBuilder<T>, T[K]> {
        return new PropertyModifier<ReplicationBuilder<T>, T[K]>(this, childNode, this.replica)
    }

    /**
     * produces the replica
     * @returns {T} replica
     */
    public build(): T {
        if (this.freeze) {
            this.replica = deepFreeze(this.replica)
        }
        return this.replica
    }
}

/**
 * Operator for nodes of the replica
 */
class ReplicaChildOperator<RT, T> {
    private buildFunction: ()=>RT
    private node: T
    private replica: RT;
    private relativePath;

    constructor(buildFunction: () => RT, replica: RT, node: T, relativePath: string) {
        this.buildFunction = buildFunction
        this.node = node
        this.replica = replica;
        this.relativePath = relativePath;
    }

    /** switch to child node
     * @param {K} childNode of this node
     * @returns {ReplicaChildOperator<RT, N[K]>} traversable child node
     **/
    getChild<K extends keyof T>(childNode: K): ReplicaChildOperator<RT, T[K]> {
        let branch = this.node[childNode]
        return new ReplicaChildOperator(this.buildFunction, this.replica, branch, this.relativePath + '.' + childNode)
    }

    modify<K extends keyof T>(childNode: K): PropertyModifier<ReplicaChildOperator<RT, T>, T[K]> {
        return new PropertyModifier<ReplicaChildOperator<RT, T>, T[K]>(this, this.relativePath + '.' + childNode, this.replica)
    }

    /**
     * produces the replica
     * @returns {RT} replica
     */
    build():RT {
      return this.buildFunction()
    }
}

class PropertyModifier<PT, VT> {
    private replica: any
    private parent: PT
    private relativePathToRoot: string

    constructor(parent: PT, relativePathToRoot: string, rootObject: any) {
        this.replica = rootObject
        this.parent = parent
        this.relativePathToRoot = relativePathToRoot
    }

    /**
     * set the value of the property
     * @param {VT} value
     * @returns {PT}
     */
    to(value: VT): PT {
        _.set(this.replica, this.relativePathToRoot, value)
        return this.parent
    }

    /**
     * sets the value of the property by a function
     * @param setFunction:(VT) => T injected function that creates the new value by knowing the old value (e.g. (oldValueArray) => [...oldValueArray, appendedValue]
     * @returns PT this
     */
    by(setFunction: (VT) => VT): PT {
        let currentvalue = _.get(this.replica, this.relativePathToRoot)
        let value = setFunction(currentvalue)
        return this.to(value)
    }
}