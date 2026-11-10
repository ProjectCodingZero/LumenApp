/**
 * Tipos de historia clínica alineados con LumenBackend.Shared/Dtos/MedicalRecordModel.cs.
 * GET /api/pets/{id}/medical-records devuelve ResponseMedicalRecord.
 */

export interface ResponseMedicalRecord {
  id: string;
  title: string;
  temperature: number;
  weight: number;
}

export interface ResponseMedicalRecordDetails {
  id: string;
  title: string;
  observation: string;
  temperature: number;
  weight: number;
  petId: string;
}
