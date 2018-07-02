import {expect} from 'chai'
import {Concert, ObjectArray, Rockband, SimpleBand} from './testobjects'
import {ReplicationBuilder} from '../replicator'
import {deepFreeze, isDeepFrozen} from '../deepFreeze'

describe('ReplicationBuilder', () => {

    it('should clone a property and execute function on the clone ', function () {
        let concert = new Concert();
        let newBandName = 'someNewName';
        let manipulatedRoot = ReplicationBuilder.forObject(concert).replaceValueOf('band').withCloneAndDo((band) => {
            band.changeNameTo(newBandName)
        }).build();
        expect(manipulatedRoot.band.name).to.equal(newBandName);
    });

    it('Inputstate must not be modified, output must be modified', () => {
        let concert = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(concert).property('band').property('homeland').replaceValueOf('name').with('Spain').build();

        expect(concert.band.homeland.name).to.null;
        expect(manipulatedRoot.band.homeland.name).to.equal('Spain')
    });

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).property('band').property('homeland').replaceValueOf('name').with('Germany').build();

        expect(rootState.band.homeland.name).to.null;
        expect(manipulatedRoot.band.homeland.name).to.equal('Germany')
    });

    it('Inputstate must not be modified, output node must be deleted', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).removeProperty('band').build();

        expect(rootState.band).to.exist;
        expect(manipulatedRoot.band).to.not.exist
    });

    it('Inputstate must not be modified, output child node must be deleted', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).property('band').removeProperty('homeland').build();

        expect(rootState.band.homeland).to.exist;
        expect(manipulatedRoot.band.homeland).to.not.exist
    });

    it('with untyped structure: Inputstate must not be modified, output must be modified', () => {
        let simpleBand = SimpleBand;
        let manipulatedRoot = ReplicationBuilder.forObject(simpleBand).property('genre').replaceValueOf('name').with('Test').build();

        expect(simpleBand.genre.name).to.equal('initial');
        expect(manipulatedRoot.genre.name).to.equal('Test')
    });

    it('if input state is deep frozen --> output state must be deep frozen', () => {
        let concert = new Concert();
        deepFreeze(concert);
        let manipulatedRoot = ReplicationBuilder.forObject(concert).property('band').property('homeland').replaceValueOf('name').with('Test').build();

        expect(concert.band.homeland.name).to.null;
        expect(manipulatedRoot.band.homeland.name).to.equal('Test');
        expect(isDeepFrozen(manipulatedRoot)).true
    });

    it('redux like root state --> if input state is deep frozen --> output state must be deep frozen', () => {
        let festival = {
            band: new Rockband()
        };
        deepFreeze(festival);
        let newFestival = ReplicationBuilder.forObject(festival).property('band').replaceValueOf('members')
            .by((oldMembers) => [...oldMembers, 'NewRocker']).build();

        expect(festival.band.members.length).to.equal(0);
        expect(newFestival.band.members[0]).to.equal('NewRocker');
        expect(isDeepFrozen(newFestival)).true
    });

    it('if input state is NOT frozen --> output state must NOT be frozen', () => {
        let concert = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(concert).property('band').property('homeland').replaceValueOf('name').with('USA').build();
        expect(Object.isFrozen(manipulatedRoot)).false
    });

    it('test performance of frozen big array', () => {
        let objectCount = 5000;
        let rootState = new ObjectArray(objectCount);
        deepFreeze(rootState);

        let repeatCount = 1;
        let startTimestamp = new Date().getTime();
        for (let i = 0; i < repeatCount; i++) {
            ReplicationBuilder.forObject(rootState).build()
        }
        let durationinMS = new Date().getTime() - startTimestamp;
        console.info(repeatCount + ' clone repetitions with ' + objectCount + ' objects took ' + durationinMS + 'ms');


        expect(durationinMS).to.be.below(300)
    });

    it('test performance of not frozen big array', () => {
        let objectCount = 5000;
        let rootState = new ObjectArray(objectCount);

        let repeatCount = 1;
        let startTimestamp = new Date().getTime();
        for (let i = 0; i < repeatCount; i++) {
            ReplicationBuilder.forObject(rootState).build()
        }
        let durationinMS = new Date().getTime() - startTimestamp;
        console.info(repeatCount + ' clone repetitions with ' + objectCount + ' objects took ' + durationinMS + 'ms');


        expect(durationinMS).to.be.below(100)
    });


});
