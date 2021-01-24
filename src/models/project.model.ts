export enum ProjectStatus { Active = 'active', Finished = 'finished' };

export class Project {
    constructor (
        public id: number,
        public title: string,
        public description: string,
        public people: number,
        public status = ProjectStatus.Active) {}

    get peopleText() {
        const isPlural = this.people > 1;

        return `${this.people} ${isPlural ? 'people' : 'person'}`;
    }
}
