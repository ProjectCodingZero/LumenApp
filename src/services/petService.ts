export type Status = 'alive' | 'dead' | 'entreatment' | 'adopted' | 'lost';
export interface RequestPetCreate {
    document: string;
    name: string;
    age: number;
    birthDate: Date;
    status: Status;
    raceId: string;
}
export interface ResponsePetCreate {
    id: string;
}