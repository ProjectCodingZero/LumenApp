export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

/** Evalúa la fortaleza de una contraseña (0 a 4) */
export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Fuerte'];
  return { score: score as PasswordStrength['score'], label: labels[score] };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Solo dígitos (documento, teléfono, código postal) */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}
