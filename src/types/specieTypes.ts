/**
 * Tipos de especies y razas alineados con LumenBackend.Shared/Dtos/SpecieModel.cs y RaceModel.cs.
 * Nota: GET /api/species/{id}/races devuelve un envoltorio FluentResults,
 * por eso existe el tipo LumenResult.
 */

import { ResponseRace } from './raceTypes';

export interface ResponseSpecie {
  id: string;
  name: string;
}

export interface ResponseSpecieRace {
  specieId: string;
  specieName: string;
  races: ResponseRace[] | null;
}

/** Envoltorio de FluentResults que el backend serializa tal cual en algunos endpoints */
export interface LumenResult<T> {
  value: T;
  valueOrDefault: T;
  isFailed: boolean;
  isSuccess: boolean;
  reasons: unknown[];
  errors: unknown[];
  successes: unknown[];
}
