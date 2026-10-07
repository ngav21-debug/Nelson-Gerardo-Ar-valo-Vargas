# Transcripción de declaraciones juramentadas (.docx) — anexo de trabajo

> **Nota para Gemini:** no uses `scripts/`, `python-docx` ni `docx-js`. Consolida las declaraciones como texto en la conversación, conservando la estructura (intervinientes, marcas de tiempo, texto literal) y la advertencia metodológica.

Cuando el expediente incluye declaraciones o testimonios practicados por videoconferencia (Microsoft Teams, Google Meet), el despacho suele conservarlos como archivos `.docx` con la transcripción automática generada por la propia herramienta durante la diligencia. Cuando el usuario pida "la transcripción de las declaraciones" (o un archivo que consolide varias), sigue este protocolo en vez de copiar el archivo crudo tal cual — el original trae ruido propio del formato de exportación (identificadores numéricos, saltos de línea internos) que conviene depurar sin alterar el contenido dicho por los intervinientes.

Para la mecánica de generación en sí (docx-js, verificación por renderizado) sigue siempre la skill `docx`. El script `scripts/plantilla_transcripcion.js` (en este mismo skill) implementa ya el parseo y el documento base — pártelo como base en vez de reconstruirlo.

## 1. Estructura del archivo fuente

Cada declaración exportada trae, por lo general:

- Un primer párrafo con el título/asunto de la reunión, uno con la fecha y hora, y uno con la duración total.
- Un párrafo de sistema: `"<Nombre> ha iniciado la transcripción"` (y, al final, `"... ha detenido la transcripción"`).
- Un párrafo por cada intervención (turno de palabra), con el patrón `"<Nombre del interviniente>␣␣<marca de tiempo>\n<texto dicho>"` — la marca de tiempo es `M:SS` o, pasada la primera hora de grabación, `H:MM:SS`. Dentro del mismo turno puede haber varios saltos de línea internos (`\n`) que NO son turnos nuevos, solo fragmentación del motor de transcripción.

Extráelo con `python-docx` (`Document(path).paragraphs`), no con `pandoc` ni extracción cruda de XML, para conservar los saltos de línea (`\n`) que distinguen "nueva oración del mismo turno" de "nuevo párrafo".

Regex de parseo (Python) que separa interviniente, marca de tiempo y texto — soporta `M:SS` y `H:MM:SS`:

```python
import re
SPEAKER_RE = re.compile(r'^\n?(.*?)\s{2,}(\d{1,2}(?::\d{2}){1,2})\n(.*)$', re.DOTALL)
```

Si el párrafo no coincide con el patrón, es un mensaje de sistema (inicio/fin de transcripción) — trátalo como nota centrada, no como intervención.

## 2. Advertencia metodológica obligatoria

El texto es una transcripción **automática** de voz a texto, no editada por el despacho contra el audio/video. Es previsible que contenga errores de reconocimiento en nombres propios, cifras, radicados y términos técnicos (p. ej., "IUS-E-2021-726546" transcrito como "usted 2000 21726.546", o "Oswal Fontecha Pachón" como "Owen fontecha"). **No corrijas estos errores por tu cuenta** — no tienes forma de verificar contra el audio qué se dijo realmente, y "corregir" es una forma de inventar contenido en una pieza de prueba. Reproduce el texto tal como viene (solo puedes: unir los saltos de línea internos de un mismo turno en un párrafo legible, y retirar los identificadores numéricos de exportación que no son texto hablado). Incluye siempre, al inicio del documento generado, un párrafo de advertencia que deje esto explícito y remita a la grabación como fuente para verificar cualquier pasaje antes de citarlo en una decisión de fondo.

## 3. Estructura del documento consolidado

1. Portada: título, radicado, y la advertencia metodológica del punto 2 (usa el helper `bracket()` de `plantilla_auto.js` o un estilo equivalente).
2. Tabla de contenido: N.°, declarante, fecha, duración.
3. Una sección por declarante (salto de página entre secciones), con: encabezado con nombre, línea de metadatos (fecha, duración, archivo fuente exacto) y el cuerpo completo de la transcripción.
4. Cada turno de palabra: un párrafo con el nombre del interviniente en negrita seguido de la marca de tiempo entre corchetes en cursiva pequeña, y un párrafo siguiente (justificado, con sangría) con lo dicho.
5. Reutiliza el membrete y pie de página institucionales de `formato_auto.md` para que el anexo se vea consistente con el resto de piezas del expediente, pero identifica el documento como **anexo de trabajo** (no como providencia) en el pie de página.

## 4. Verificación obligatoria

Convierte a PDF y revisa que: (i) la advertencia metodológica aparece en la primera página; (ii) cada declarante inicia en página nueva con sus metadatos completos; (iii) no quedan turnos sin separar (un mismo bloque con dos nombres distintos indica que la regex no partió correctamente ese turno — revisa marcas de tiempo `H:MM:SS`); (iv) el conteo de turnos por declarante coincide con el número de párrafos "con patrón" detectados en el parseo (deja este número en el log del script para poder verificarlo).
