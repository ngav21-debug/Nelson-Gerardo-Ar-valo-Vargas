
// IMPORTANTE: Reemplaza estos valores con tus propias credenciales de Google Cloud.
// 1. Ve a la Consola de Google Cloud: https://console.cloud.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente.
// 3. Habilita las APIs "Google Drive API" y "Google Picker API".
// 4. Ve a "Credenciales":
//    - Crea una "Clave de API" y copia el valor en GOOGLE_API_KEY.
//    - Crea un "ID de cliente de OAuth 2.0" de tipo "Aplicación web".
//      - En "Orígenes de JavaScript autorizados", agrega la URL donde se ejecutará tu aplicación (ej. http://localhost:5173).
//      - Copia el "ID de cliente" y pégalo en GOOGLE_CLIENT_ID.

export const GOOGLE_CLIENT_ID = 'TU_ID_DE_CLIENTE_DE_GOOGLE.apps.googleusercontent.com';
export const GOOGLE_API_KEY = 'TU_CLAVE_DE_API_DE_GOOGLE';

// Alcances necesarios para que la aplicación lea los archivos de Drive.
export const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
