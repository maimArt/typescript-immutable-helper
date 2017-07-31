# typescript-immutable-replicator
Typesafe, refactorable cloning and modifying of immutable objects with typescript

[![NPM](https://nodei.co/npm/typescript-immutable-replicator.png)](https://nodei.co/npm/typescript-immutable-replicator/)

## Replicator

Replicator is a tool to replicate and modify immutable objects.

##### Typesafe properties
![image](https://user-images.githubusercontent.com/20232625/28736850-297d44e4-73ec-11e7-808c-5d0b5b47336a.png)
##### Typesafe property values
![image](https://user-images.githubusercontent.com/20232625/28736918-7c974652-73ec-11e7-9742-ae2ea6664892.png)
##### Refactorable and easy to read

### Usage

1. Load an object by calling `Replicator.forObject()`
2. Navigate down the object tree through the typesafe function `child()`
3. Modify a property with either 
    - `modify('prop').to(newValue:T)` or
    - `modify('prop').by((T) => newValue:T)` for example `((oldValue) => oldValue + newValue)`
4. Repeat step 3 and 4 until all modifications are done
5. Produce the replica with `replicate()`

### Examples

![image](https://user-images.githubusercontent.com/20232625/28736806-e85e2e74-73eb-11e7-8a39-434144de62b7.png)

![image](https://user-images.githubusercontent.com/20232625/28737014-ebc5dbba-73ec-11e7-99bf-1f190ee9a892.png)

### Behaviour

-   deep copies the source object
-   freeze in --> freeze out. If the source object was frozen (for detecting manipulations while development), then the produced replica will also be deep frozen.
-   warning if source object is not deep frozen (produced replica will be deep frozen)

## DeepFreeze

`deepFreeze()` applies Object.freeze() recursively on an object to make it immutable
`isDeepFrozen()` checks if an object is recursively frozen.
