class ParentTypeA {
    parentAttribute:string = "i am your father";
}

interface ISubTypeA{
    subTypeAAttribute: string;
    subTypeAArray: string[];
    subTypeB: SubTypeB;
}

export class SubTypeA extends ParentTypeA implements ISubTypeA{
    subTypeAAttribute: string = null
    subTypeAArray: string[] = []
    subTypeB: SubTypeB = new SubTypeB()

    doNothingFunction() {
        // do nothing
        let test:number = 0
        test = 1
    }
}

class SubTypeB {
    subTypeBAttribute: string = null
    subTypeBArray: string[] = []
    subTypeB: SubTypeC = new SubTypeC()
}

class SubTypeC {
    subTypeCAttribute: string = null
    subTypeCArray: string[] = []
}

export class ClassorientedTeststate {
    subTypeA: SubTypeA = new SubTypeA()
}

export const SimpleTeststate = {
    subTypeAAttribute: 'initial',
    subTypeAArray: ['initial'],
    subTypeB: {
        subtypeBAttribute: 'initial'
    }
}

export class SomeObject {
    attA: string;
    attB: string;
    attC: string;
    attD: string;


    constructor(attA: string, attB: string, attC: string, attD: string) {
        this.attA = attA
        this.attB = attB
        this.attC = attC
        this.attD = attD
    }
}

export class ObjectArray {
    array: SomeObject[] = [];

    constructor(count: number){
        for(let i = 0; i < count; i++){
            this.array[i] = new SomeObject("AttributeA"+ i,"AttributeB"+ i,"AttributeC"+ i,"AttributeD"+ i)
        }
    }
}