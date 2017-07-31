# typescript-immutable-replicator
Typesafe, refactorable handling of immutable objects with typescript

[![NPM](https://nodei.co/npm/typescript-immutable-replicator.png)](https://nodei.co/npm/typescript-immutable-replicator/)

## Replicator

Replicator is an utility to replicate an object.

![image](https://user-images.githubusercontent.com/20232625/28767484-22a1d330-75d4-11e7-9667-01271c7e2448.png)

##### typesafe properties
![image](https://user-images.githubusercontent.com/20232625/28767468-14cb5aa6-75d4-11e7-8193-dcf828133035.png)
##### typesafe property values
![image](https://user-images.githubusercontent.com/20232625/28767500-3b6f082e-75d4-11e7-8ec3-1e1392209396.png)
##### chainable
![image](https://user-images.githubusercontent.com/20232625/28767664-dc00269c-75d4-11e7-9c6d-c179c0b12eaf.png)
##### tefactorable and easy to read

### Usage

1. Load an object by calling `Replicator.forObject()`
2. Navigate down the object tree through the typesafe function `child()`
3. Modify a property with either 
    - `modify('prop').to(newValue:T)` or
    - `modify('prop').by((T) => newValue:T)` for example `((oldValue) => oldValue + newValue)`
4. Repeat step 3 and 4 until all modifications are done
5. Produce the replica with `replicate()`

### Examples

![image](https://user-images.githubusercontent.com/20232625/28767484-22a1d330-75d4-11e7-9667-01271c7e2448.png)

![image](https://user-images.githubusercontent.com/20232625/28767522-55f40ea6-75d4-11e7-8faf-0c1bf9f91953.png)

### Behaviour

-   deep copies the source object
-   freeze in --> freeze out. If the source object was frozen (for detecting manipulations while development), then the produced replica will also be deep frozen.
-   warning if source object is not deep frozen (produced replica will be deep frozen)

## DeepFreeze

`deepFreeze()` applies Object.freeze() recursively on an object to make it immutable
`isDeepFrozen()` checks if an object is recursively frozen.
