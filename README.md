# typescript-immutable-helper
Helpers for handling immutable objects with typescript

[![NPM](https://nodei.co/npm/typescript-immutable-helper.png)](https://nodei.co/npm/typescript-immutable-helper/)

## Replicator

Replicator is a tool to replicate and modify immutable objects.

### Syntax
```typescript 
let replica = ReplicationBuilder.forObject(immutableObject).getChild("child").modify("attribute").to("value").build()
```

### Characteristics
###### typesafe properties
![image](https://user-images.githubusercontent.com/20232625/28767468-14cb5aa6-75d4-11e7-8193-dcf828133035.png)
###### typesafe property values
![image](https://user-images.githubusercontent.com/20232625/28767500-3b6f082e-75d4-11e7-8ec3-1e1392209396.png)
###### chainable
![image](https://user-images.githubusercontent.com/20232625/28767664-dc00269c-75d4-11e7-9c6d-c179c0b12eaf.png)
###### refactorable and easy to read

### Usage

1. Load an object by calling `ReplicationBuilder.forObject()`
2. Navigate down the object tree through the typesafe function `getChild()`
3. Modify a property with either 
    - `modify('prop').to(newValue:T)` or
    - `modify('prop').by((T) => newValue:T)` for example `((oldValue) => oldValue + newValue)`
4. Repeat step 3 and 4 until all modifications are done
5. Produce the replica with `build()`

### Examples
```Typescript
let replica = ReplicationBuilder.forObject(state).getChild("party").modify("name").to("MyParty").build();
```
```Typescript
let replica = ReplicationBuilder.forObject(state).getChild("party").modify("members").by((members) => [...members, newMember]);
```

### Behaviour

-   deep copies the source object
-   freeze in --> freeze out. If the source object was frozen (for detecting manipulations while development), then the produced replica will also be deep frozen.
-   warning if source object is not deep frozen (produced replica will be deep frozen)

## DeepFreeze

`deepFreeze()` applies Object.freeze() recursively on an object to make it immutable
`isDeepFrozen()` checks if an object is recursively frozen.
