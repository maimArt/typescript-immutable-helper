import * as _ from 'lodash'
import {deepFreeze, isDeepFrozen} from './deepFreeze'

/**
 * Class that helps to replicate a new object by encapsulating a deep copy of the source object
 * If input object is frozen by (@link Object.freeze()} or {@link deepFreeze} then the replica will be produced frozen
 * freeze in --> deep freeze out
 * Warns if source object is just frozen, not deep frozen
 **/
export class ReplicationBuilder<T> {
    private replica: T = null;
    private readonly freeze;

    /**
     * default constructor
     * @param {RT} sourceObject traversing object
     */
    private constructor(sourceObject: T) {
        this.replica = _.cloneDeep(sourceObject);
        this.freeze = Object.isFrozen(sourceObject);
        if (this.freeze && !isDeepFrozen(sourceObject)) {
            console.warn('Source object is frozen but not deep frozen. Please care that always deepFreeze() is used to recursively freeze the object')
        }
    }

    public static forObject<T>(sourceObject: T): ReplicationBuilder<T> {
        return new ReplicationBuilder<T>(sourceObject)
    }

    /**
     * @deprecated since 0.4.1
     * use getProperty instead
     */
    public getChild<K extends keyof T>(childNode: K): ReplicaChildOperator<T, T[K]> {
        return this.getProperty(childNode);
    }

    /** switch to child node
     * @param {K} childNode of the root node
     * @returns {ReplicaChildOperator<T, T[K]>} operator of child node
     **/
    public getProperty<K extends keyof T>(childNode: K): ReplicaChildOperator<T, T[K]> {
        let node = this.replica[childNode];
        return new ReplicaChildOperator((() => this.build()), this.replica, node, childNode)
    }

    /**
     * @deprecated since 0.4.1
     * use replaceProperty instead
     */
    public modify<K extends keyof T>(childNode: K): PropertyModifier<ReplicationBuilder<T>, T[K]> {
        return this.replaceProperty(childNode);
    }

    public replaceProperty<K extends keyof T>(childNode: K): PropertyModifier<ReplicationBuilder<T>, T[K]> {
        return new PropertyModifier<ReplicationBuilder<T>, T[K]>(this, childNode, this.replica)
    }

    /**
     * @deprecated since 0.4.1
     * use removeProperty instead
     */
    public delete<K extends keyof T>(childNode: K): ReplicationBuilder<T> {
        return this.removeProperty(childNode);
    }

    public removeProperty<K extends keyof T>(childNode: K): ReplicationBuilder<T> {
        if (this.replica[childNode]) {
            delete this.replica[childNode]
        }

        return this;
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
export class ReplicaChildOperator<RT, T> {
    private readonly buildFunction: () => RT;
    private readonly node: T;
    private readonly replica: RT;
    private readonly relativePath;

    constructor(buildFunction: () => RT, replica: RT, node: T, relativePath: string | number | symbol) {
        this.buildFunction = buildFunction;
        this.node = node;
        this.replica = replica;
        this.relativePath = relativePath;
    }

    /**
     * @deprecated since 0.4.1
     * use getProperty instead
     */
    getChild<K extends keyof T>(childNode: K): ReplicaChildOperator<RT, T[K]> {
        return this.getProperty(childNode);
    }


    /** switch to child node
     * @param {K} childNode of this node
     * @returns {ReplicaChildOperator<RT, N[K]>} traversable child node
     **/
    getProperty<K extends keyof T>(childNode: K): ReplicaChildOperator<RT, T[K]> {
        let branch = this.node[childNode];
        return new ReplicaChildOperator(this.buildFunction, this.replica, branch, this.relativePath + '.' + childNode)
    }

    /**
     * @deprecated since 0.4.1
     * use replaceProperty instead
     */
    modify<K extends keyof T>(childNode: K): PropertyModifier<ReplicaChildOperator<RT, T>, T[K]> {
        return this.replaceProperty(childNode);
    }

    replaceProperty<K extends keyof T>(childNode: K): PropertyModifier<ReplicaChildOperator<RT, T>, T[K]> {
        return new PropertyModifier<ReplicaChildOperator<RT, T>, T[K]>(this, this.relativePath + '.' + childNode, this.replica)
    }

    /**
     * @deprecated since 0.4.1
     * use removeProperty instead
     */
    delete<K extends keyof T>(childNode: K): ReplicaChildOperator<RT, T> {
        return this.removeProperty(childNode);
    }

    removeProperty<K extends keyof T>(childNode: K): ReplicaChildOperator<RT, T> {
        if (this.node[childNode]) {
            delete this.node[childNode]
        }

        return this;
    }

    /**
     * produces the replica
     * @returns {RT} replica
     */
    build(): RT {
        return this.buildFunction()
    }
}

export class PropertyModifier<PT, VT> {
    private readonly replica: any;
    private readonly parent: PT;
    private readonly relativePathToRoot: string | number | symbol;

    constructor(parent: PT, relativePathToRoot: string | number | symbol, rootObject: any) {
        this.replica = rootObject;
        this.parent = parent;
        this.relativePathToRoot = relativePathToRoot
    }

    /**
     * @deprecated since 0.4.1
     * use with instead
     */
    to(value: VT): PT {
        return this.with(value)
    }

    /**
     * set the value of the property
     * @param {VT} value
     * @returns {PT}
     */
    with(value: VT): PT {
        _.set(this.replica, this.relativePathToRoot, value);
        return this.parent
    }

    /**
     * sets the value of the property by a function
     * @param setFunction:(VT) => T injected function that creates the new value by knowing the old value (e.g. (oldValueArray) => [...oldValueArray, appendedValue]
     * @returns PT this
     */
    by(setFunction: (VT) => VT): PT {
        let currentvalue = _.get(this.replica, this.relativePathToRoot);
        let value = setFunction(currentvalue);
        return this.with(value)
    }
}