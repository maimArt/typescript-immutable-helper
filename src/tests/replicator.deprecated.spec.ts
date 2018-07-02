import {expect} from 'chai'
import {Concert, Rockband, SimpleBand} from './testobjects'
import {ReplicationBuilder} from '../replicator'
import {deepFreeze, isDeepFrozen} from '../deepFreeze'

describe('Deprecated API of ReplicationBuilder', () => {

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('band').getChild('homeland').modify('name').to('Test').build();

        expect(rootState.band.homeland.name).to.null;
        expect(manipulatedRoot.band.homeland.name).to.equal('Test')
    });

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('band').getChild('homeland').modify('name').to('Test').build();

        expect(rootState.band.homeland.name).to.null;
        expect(manipulatedRoot.band.homeland.name).to.equal('Test')
    });

    it('Inputstate must not be modified, output node must be deleted', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).delete('band').build();

        expect(rootState.band).to.exist;
        expect(manipulatedRoot.band).to.not.exist
    });

    it('Inputstate must not be modified, output child node must be deleted', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('band').delete('homeland').build();

        expect(rootState.band.homeland).to.exist;
        expect(manipulatedRoot.band.homeland).to.not.exist
    });

    it('to untyped structure: Inputstate must not be modified, output must be modified', () => {
        let rootState = SimpleBand;
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('genre').modify('name').to('Test').build();

        expect(rootState.genre.name).to.equal('initial');
        expect(manipulatedRoot.genre.name).to.equal('Test')
    });

    it('if input state is deep frozen --> output state must be deep frozen', () => {
        let rootState = new Concert();
        deepFreeze(rootState);
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('band').getChild('homeland').modify('name').to('Test').build();

        expect(rootState.band.homeland.name).to.null;
        expect(manipulatedRoot.band.homeland.name).to.equal('Test');
        expect(isDeepFrozen(manipulatedRoot)).true
    });

    it('redux like root state --> if input state is deep frozen --> output state must be deep frozen', () => {
        let rootState = {
            band: new Rockband()
        };
        deepFreeze(rootState);
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('band').modify('members')
            .by((oldMembers) => [...oldMembers, 'Test']).build();

        expect(rootState.band.members.length).to.equal(0);
        expect(manipulatedRoot.band.members[0]).to.equal('Test');
        expect(isDeepFrozen(manipulatedRoot)).true
    });

    it('if input state is NOT frozen --> output state must NOT be frozen', () => {
        let rootState = new Concert();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('band').getChild('homeland').modify('name').to('Test').build();

        expect(Object.isFrozen(manipulatedRoot)).false
    });
});
