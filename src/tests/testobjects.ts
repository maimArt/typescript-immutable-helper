export interface Band {
    name: string;
    members: string[];
    homeland: Country;
}

export class Rockband implements Band {
    name: string = null;
    members: string[] = [];
    homeland: Country = new Country();

    changeNameTo(newValue: string) {
        this.name = newValue;
    }
}

class Country {
    name: string = null;
    language: Language = new Language()
}

class Language {
    name: String;
}

export class Concert {
    name: String;
    band: Rockband = new Rockband()
}

export const SimpleBand = {
    name: 'initial',
    members: ['initial'],
    genre: {
        name: 'initial'
    }
};

export class SomeObject {
    attA: string;
    attB: string;
    attC: string;
    attD: string;


    constructor(attA: string, attB: string, attC: string, attD: string) {
        this.attA = attA;
        this.attB = attB;
        this.attC = attC;
        this.attD = attD
    }
}

export class ObjectArray {
    array: SomeObject[] = [];

    constructor(count: number) {
        for (let i = 0; i < count; i++) {
            this.array[i] = new SomeObject('AttributeA' + i, 'AttributeB' + i, 'AttributeC' + i, 'AttributeD' + i)
        }
    }
}