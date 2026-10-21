const DEV_API_URL = 'https://api.lumen-soft.app/api';
const PROD_API_URL = 'https://api.lumen-soft.app/api';
export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;