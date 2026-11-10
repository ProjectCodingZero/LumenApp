import { GenderType, PetStatus } from '@/types/petTypes';

export type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusDisplay {
  label: string;
  tone: BadgeTone;
}

const STATUS_DISPLAY: Record<PetStatus, StatusDisplay> = {
  Alive: { label: 'Vivo', tone: 'success' },
  Entreatment: { label: 'En tratamiento', tone: 'warning' },
  Adopted: { label: 'Adoptado', tone: 'info' },
  Lost: { label: 'Perdido', tone: 'error' },
  Dead: { label: 'Fallecido', tone: 'neutral' },
  Unknown: { label: 'Desconocido', tone: 'neutral' },
};

const GENDER_LABEL: Record<GenderType, string> = {
  Male: 'Macho',
  Female: 'Hembra',
  Other: 'Otro',
};

export function getStatusDisplay(status: PetStatus): StatusDisplay {
  return STATUS_DISPLAY[status] ?? STATUS_DISPLAY.Unknown;
}

export function getGenderLabel(gender: GenderType): string {
  return GENDER_LABEL[gender] ?? GENDER_LABEL.Other;
}

/** "3 años 2 meses" | "5 meses" | "Recién nacido" */
export function formatAge(years: number, months: number): string {
  if (years <= 0 && months <= 0) return 'Recién nacido';
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
  return parts.join(' ');
}

/** Formatea una fecha ISO (YYYY-MM-DD) como dd/mm/aaaa sin depender del locale */
export function formatBirthDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

/** Nombre propio de la especie para el icono de avatar */
export function getSpecieIconName(specie: string): 'dog' | 'cat' | 'paw' {
  const normalized = specie?.toLowerCase() ?? '';
  if (normalized.includes('perr') || normalized.includes('dog')) return 'dog';
  if (normalized.includes('gat') || normalized.includes('cat')) return 'cat';
  return 'paw';
}

/** Iniciales para avatares de personas ("Juan Pérez" -> "JP") */
export function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}
