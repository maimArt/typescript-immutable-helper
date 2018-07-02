# typescript-immutable-helper
Helpers for handling immutable objects with typescript

[![NPM](https://nodei.co/npm/typescript-immutable-helper.png)](https://nodei.co/npm/typescript-immutable-helper/)

## Replicator

Replicator is a tool to replicate and modify immutable objects.

### Syntax
##### simply replace property by with new value
```Typescript
return ReplicationBuilder.forObject(state).property('party').replaceValueOf('name').with('MyParty').build()
```
##### replace property depending on old value
```Typescript
return ReplicationBuilder.forObject(state).property('party').replaceValueOf('partymemberArray').by((oldPartymemberArray) => [...oldPartymemberArray, 'new partymember']).build()
```
##### clone property and apply some function on it
```Typescript
return ReplicationBuilder.forObject(state).replaceValueOf('party').withCloneAndDo((clonedParty) => clonedParty.addPartyMember('new partymember')).build()
```

### Characteristics
##### typesafe properties

![image](https://user-images.githubusercontent.com/20232625/42183566-94342602-7e42-11e8-9ea8-b3ddcc510561.png)
##### typesafe property values

![image](https://user-images.githubusercontent.com/20232625/42183584-a72a0ed4-7e42-11e8-9fd4-ff43aacef239.png)
##### chainable
```Typescript
return ReplicationBuilder.forObject(state)
    .property('party').replaceValueOf('name').with('MyParty').replaceValueOf('members').by((members) => [...members, newMember])
    .property('initiator').replaceValueOf('prename').with('Party').replaceValueOf('surname').with('guy')
    .build();
```
###### refactorable and easy to read

### Usage

1. Load an object by calling `ReplicationBuilder.forObject()`
2. Navigate down the object tree through the typesafe function `property()`
3. Modify a property with either (see syntax paragraph above)
    - `replaceValueOf('prop').with(newValue:T)`
    - `replaceValueOf('prop').by((T) => newValue:T)`
    - `replaceValueOf('prop').withCloneAndDo((clonedProp) => clonedProp.doSomething()`    
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






