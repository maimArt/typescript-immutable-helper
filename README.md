# typescript-immutable-helper
Helpers for handling immutable objects with typescript

[![NPM](https://nodei.co/npm/typescript-immutable-helper.png)](https://nodei.co/npm/typescript-immutable-helper/)

## Replicator

Replicator is a tool to replicate and modify immutable objects.

### Syntax
##### simply replace property by with new value
```Typescript
return ReplicationBuilder.forObject(state).getProperty('party').replaceProperty('name').with('MyParty').build()
```
##### replace property depending on old value
```Typescript
return ReplicationBuilder.forObject(state).getProperty('party').replaceProperty('partymemberArray').by((oldPartymemberArray) => [...oldPartymemberArray, 'new partymember']).build()
```
##### clone property and apply some function on it
```Typescript
return ReplicationBuilder.forObject(state).replaceProperty('party').andDo((clonedParty) => clonedParty.addPartyMember('new partymember')).build()
```

### Characteristics
##### typesafe properties

![image](https://user-images.githubusercontent.com/20232625/28767468-14cb5aa6-75d4-11e7-8193-dcf828133035.png)
##### typesafe property values

![image](https://user-images.githubusercontent.com/20232625/28767500-3b6f082e-75d4-11e7-8ec3-1e1392209396.png)
##### chainable
```Typescript
return ReplicationBuilder.forObject(state)
    .getProperty('party').replaceProperty('name').with('MyParty').replaceProperty('members').by((members) => [...members, newMember])
    .getProperty('initiator').replaceProperty('prename').with('Party').replaceProperty('surname').with('guy')
    .build();
```
###### refactorable and easy to read

### Usage

1. Load an object by calling `ReplicationBuilder.forObject()`
2. Navigate down the object tree through the typesafe function `getChild()`
3. Modify a property with either (see syntax paragraph above)
    - `replaceProperty('prop').with(newValue:T)`
    - `replaceProperty('prop').by((T) => newValue:T)`
    - `replaceProperty('prop').andDo((clonedProp) => clonedProp.doSomething()`    
    - `removeProperty('prop')` to remove the property in the resulting object
4. Repeat step 3 and 4 until all modifications are done
5. Produce the replica with `build()`

### Behaviour

-   deep copies the source object
-   freeze in --> freeze out. If the source object was frozen (for detecting manipulations while development), then the produced replica will also be deep frozen.
-   warning if source object is not deep frozen (produced replica will be deep frozen)

## DeepFreeze

DeepFreeze freezes an object recursively and the developer is pointed to illegal state manipulations by errors in the javascript console.

`deepFreeze()` applies Object.freeze() recursively on an object to make it immutable
`isDeepFrozen()` checks if an object is recursively frozen.

## Example: Usage of Replicator and DeepFreeze in an angular redux module

```Typescript
export class StoreModule {
  constructor(/* ... */) {
    /* ... */
    const rootState = isDevMode()? deepFreeze(INITIAL_ROOTSTATE) : INITIAL_ROOTSTATE    

    store.configureStore(
      rootReducer,
      rootState,
      middlewares,
      storeEnhancer
    )
  }
}
```

If the state is initially frozen and you are using the Replicator for handling the updates, the state will get frozen again by the replicator.






