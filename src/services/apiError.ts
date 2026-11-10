import { isAxiosError } from 'axios';

/**
 * Traduce errores de la API a mensajes en español entendibles por el usuario.
 * Soporta los formatos que devuelve LumenBackend:
 * - string plano ("Usuario sin autorizacion")
 * - array de errores FluentResults ([{ message, ... }])
 * - ProblemDetails ({ title, detail })
 * - ModelState de ASP.NET ({ errors: { Campo: ['Error'] } })
 */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      const message = extractMessage(error.response.data);
      if (message) return message;
      return `Error del servidor (código ${error.response.status}).`;
    }
    if (error.request) {
      return 'No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.';
    }
    return 'Ocurrió un error inesperado al comunicarse con el servidor.';
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Ocurrió un error inesperado.';
}

function extractMessage(data: unknown): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data.trim() || null;
  if (Array.isArray(data)) {
    const messages = data.map(extractMessage).filter((m): m is string => Boolean(m));
    return messages.length > 0 ? messages.join('\n') : null;
  }
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    for (const key of ['title', 'detail', 'message']) {
      if (typeof obj[key] === 'string' && (obj[key] as string).trim()) {
        return obj[key] as string;
      }
    }
    if (obj.errors && typeof obj.errors === 'object') {
      const parts = Object.entries(obj.errors as Record<string, unknown>).map(
        ([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : value}`
      );
      if (parts.length > 0) return parts.join('\n');
    }
  }
  return null;
}
