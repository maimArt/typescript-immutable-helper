# typescript-immutable-replicator
Typesafe, refactorable handling of immutable objects with typescript

[![NPM](https://nodei.co/npm/typescript-immutable-replicator.png)](https://nodei.co/npm/typescript-immutable-replicator/)

## Replicator

Replicator is an utility to replicate an object. It is typesafe by using the keyof-Operator to check string literal types. 

1. Load an object by calling `Replicator.forObject()`
2. Navigate down the object tree through the typesafe function `child()`
3. Modify a property with either 
    - `modify('prop').to(newValue:T)` or
    - `modify('prop').by((T) => newValue:T)` for example `((oldValue) => oldValue + newValue)`
4. Repeat step 3 and 4 until all modifications are done
5. Produce the replica with `replicate()`

### Behaviour

-   deep copies the source object
-   freeze in --> freeze out. If the source object was frozen (for detecting manipulations while development), then the produced replica will also be deep frozen.
-   warning if source object is not deep frozen (produced replica will be deep frozen)

### DeepFreeze

`deepFreeze()` applies Object.freeze() recursively on an object to make it immutable
`isDeepFrozen()` checks if an object is recursively frozen.