const DEV_API_URL = 'http://192.168.100.9:8101/api';
const PROD_API_URL = 'https://api.lumen-soft.app/api';

// En desarrollo apunta a la API local; en producción a la API desplegada.
export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// Número de la guardia veterinaria 24/7. Dejar vacío hasta confirmar el real;
// si está vacío, la app informa que no está configurado en lugar de marcar un número falso.
export const EMERGENCY_PHONE = '';
