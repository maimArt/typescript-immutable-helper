import {expect} from 'chai'
import {ClassorientedTeststate, SimpleTeststate, SubTypeA} from './testobjects'
import {ReplicationBuilder} from '../replicator'
import {deepFreeze, isDeepFrozen} from '../deepFreeze'

describe('Deprecated API of ReplicationBuilder', () => {

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new ClassorientedTeststate();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeA').getChild('subTypeB').modify('subTypeBAttribute').to('Test').build();

        expect(rootState.subTypeA.subTypeB.subTypeBAttribute).to.null;
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBAttribute).to.equal('Test')
    });

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new ClassorientedTeststate();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeA').getChild('subTypeB').modify('subTypeBAttribute').to('Test').build();

        expect(rootState.subTypeA.subTypeB.subTypeBAttribute).to.null;
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBAttribute).to.equal('Test')
    });

    it('Inputstate must not be modified, output node must be deleted', () => {
        let rootState = new ClassorientedTeststate();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).delete('subTypeA').build();

        expect(rootState.subTypeA).to.exist;
        expect(manipulatedRoot.subTypeA).to.not.exist
    });

    it('Inputstate must not be modified, output child node must be deleted', () => {
        let rootState = new ClassorientedTeststate();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeA').delete('subTypeB').build();

        expect(rootState.subTypeA.subTypeB).to.exist;
        expect(manipulatedRoot.subTypeA.subTypeB).to.not.exist
    });

    it('to untyped structure: Inputstate must not be modified, output must be modified', () => {
        let rootState = SimpleTeststate;
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeB').modify('subtypeBAttribute').to('Test').build();

        expect(rootState.subTypeB.subtypeBAttribute).to.equal('initial');
        expect(manipulatedRoot.subTypeB.subtypeBAttribute).to.equal('Test')
    });

    it('if input state is deep frozen --> output state must be deep frozen', () => {
        let rootState = new ClassorientedTeststate();
        deepFreeze(rootState);
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeA').getChild('subTypeB').modify('subTypeBAttribute').to('Test').build();

        expect(rootState.subTypeA.subTypeB.subTypeBAttribute).to.null;
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBAttribute).to.equal('Test');
        expect(isDeepFrozen(manipulatedRoot)).true
    });

    it('redux like root state --> if input state is deep frozen --> output state must be deep frozen', () => {
        let rootState = {
            subTypeA: new SubTypeA()
        };
        deepFreeze(rootState);
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeA').getChild('subTypeB').modify('subTypeBArray')
            .by((oldArray) => [...oldArray, 'Test']).build();

        expect(rootState.subTypeA.subTypeB.subTypeBArray.length).to.equal(0);
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBArray[0]).to.equal('Test');
        expect(isDeepFrozen(manipulatedRoot)).true
    });

    it('if input state is NOT frozen --> output state must NOT be frozen', () => {
        let rootState = new ClassorientedTeststate();
        let manipulatedRoot = ReplicationBuilder.forObject(rootState).getChild('subTypeA').getChild('subTypeB').modify('subTypeBAttribute').to('Test').build();

        expect(Object.isFrozen(manipulatedRoot)).false
    });
});
