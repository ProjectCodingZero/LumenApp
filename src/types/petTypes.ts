/**
 * Tipos de mascotas alineados con LumenBackend.Shared/Dtos/PetModel.cs.
 * El backend serializa los enums como su nombre exacto (PascalCase),
 * p. ej. "Alive", "Entreatment", "Male".
 */

export type PetStatus = 'Alive' | 'Dead' | 'Entreatment' | 'Adopted' | 'Lost' | 'Unknown';
export type GenderType = 'Male' | 'Female' | 'Other';

/** POST /api/pets/me */
export interface RequestCreatePet {
  name: string;
  /** Fecha en formato ISO (YYYY-MM-DD), DateOnly en el backend */
  birthDate: string;
  status: PetStatus;
  raceId: string;
  gender: GenderType;
}

/** PUT /api/pets/{id} (parcial) */
export interface RequestUpdatePet {
  name?: string | null;
  status?: PetStatus | null;
}

export interface ResponsePetCreate {
  id: string;
}

/** GET /api/pets/me y GET /api/pets */
export interface ResponsePetMinimun {
  id: string;
  race: string;
  specie: string;
  name: string;
  years: number;
  months: number;
  birthDate: string;
  status: PetStatus;
  gender: GenderType;
}

/** GET /api/pets/{id} */
export interface ResponsePet {
  id: string;
  raceId: string;
  race: string;
  specieId: string;
  specie: string;
  name: string;
  years: number;
  months: number;
  birthDate: string;
  status: PetStatus;
  gender: GenderType;
}
