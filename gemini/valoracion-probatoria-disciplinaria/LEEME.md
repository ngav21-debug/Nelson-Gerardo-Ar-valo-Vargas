# Uso en Gemini

Versión adaptada de la skill `valoracion-probatoria-disciplinaria` (hecha para Claude). **No la he probado en Gemini**: el método y los archivos son los mismos, pero el comportamiento puede variar. Haz primero una prueba con un caso conocido y compara con la matriz y las citas de los archivos de conocimiento.

## Opción 1: Gem (aplicación de Gemini)
1. Crea un Gem nuevo y pega el contenido de `instrucciones.md` en el campo de instrucciones. Si excede el límite de caracteres de tu cuenta, recórtalo conservando el método (pasos 1 a 7), el formato de salida y las reglas de rigor.
2. Sube como archivos de conocimiento los cuatro de la carpeta `conocimiento/` (`reglas_por_tema`, `concordancia_734_1952`, `jurisprudencia_verificada`, `plantilla_matriz_probatoria`). Si tu cuenta limita el tamaño o el número de archivos, sube primero `reglas_por_tema` y `jurisprudencia_verificada`.
3. Prueba con un caso real y verifica que cite solo providencias del archivo `jurisprudencia_verificada`.

## Opción 2: AI Studio o API
Usa `instrucciones.md` como instrucción del sistema y adjunta los archivos de `conocimiento/` como contexto de la conversación.

## Opción 3: Gemini CLI
Copia `GEMINI.md` y la carpeta `conocimiento/` a la carpeta de trabajo.

## Diferencias frente a Claude
- Las skills de Claude (`evaluacion-investigacion-disciplinaria`, `derecho-disciplinario-pgn`) no existen en Gemini: aquí el estándar del pliego se cita según el art. 223 del CGD y debe verificarse en el texto oficial.
- Los archivos de conocimiento se consultan por búsqueda, no se cargan completos como en Claude; si una respuesta omite una regla, pídele que revise «reglas_por_tema».
- Las advertencias de rigor siguen vigentes: la copia de la Ley 1952 usada no tiene cambios posteriores a 2021 ni los arts. 223 y ss.; verifica vigencia y numeración antes de firmar.
