export type Status = 'alive' | 'dead' | 'entreatment' | 'adopted' | 'lost';
export type GenderType = 'male' | 'female' | 'other';
export interface RequestCreatePet {
    name: string;
    birthDate: Date;
    status: Status;
    genderType: GenderType;
    raceId: string;
}
export interface ResponsePetCreate {
    id: string;
}

export interface ResponsePet{
  id: string;
  raceId: string;
  race: string;
  specieId: string;
  specie: string;
  name: string;
  years: number;
  months: number;
  birthDate: Date;
  status: Status;
  genderType: GenderType;
}