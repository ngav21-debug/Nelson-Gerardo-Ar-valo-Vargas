# Formato institucional para autos disciplinarios (.docx) — Procuraduría Regional de Instrucción de Casanare

> **Nota para Gemini:** este archivo describe el formato original del auto en `.docx`. En Gemini no se generan archivos ni se usan scripts, imágenes ni la habilidad `docx`: aplica la estructura (tabla de radicado, numeración multinivel, notas al pie, parte resolutiva, bloque de firma) como texto para pegar en Word e ignora lo relativo a `docx-js`, `ImageRun`, `assets/`, `scripts/` y renderizado.

Este formato se extrajo de un auto real de la dependencia (radicado IUS-E-2025-050718 – IUC-D-2025-3930913, "AUTO DE TERMINACIÓN PROCEDIMIENTO DISCIPLINARIO ART. 90 C.G.D.", suscrito por la Procuradora Regional de Instrucción de Casanare) aportado por el usuario el 19 de agosto de 2026 como modelo institucional. **Úsalo como plantilla obligatoria** cada vez que se proyecte, como archivo `.docx`, un auto disciplinario de esta dependencia (archivo definitivo, terminación del procedimiento, pliego de cargos, apertura, prórroga, etc.), salvo que el usuario indique expresamente otro formato.

Para la mecánica de generación en sí (docx-js, verificación por renderizado, gotchas de la librería `docx`), sigue siempre la skill `docx`. Este archivo documenta únicamente el **formato propio de la PGN — Regional Casanare** que debe reproducirse dentro de esa mecánica. El script `scripts/plantilla_auto.js` (en este mismo skill) implementa ya todos los helpers descritos aquí — pártelo como base en vez de reconstruirlo desde cero.

## 1. Página y márgenes

Tamaño **Oficio** (carta larga), no A4 ni Carta estándar:

```js
page: {
  size: { width: 12240, height: 18720 }, // twips (dxa): 8.5in x 13in
  margin: { top: 1560, bottom: 1418, left: 1701, right: 1750, header: 284, footer: 313 },
}
```

## 2. Encabezado (header, todas las páginas)

Tabla de 2 columnas sin bordes: celda izquierda con el logotipo institucional (`assets/logo_pgn.jpeg` en este skill), celda derecha con el número de radicado en dos líneas, alineado a la derecha, fuente 7pt (`size: 14` en medios-punto).

```js
new ImageRun({ type: "jpg", data: logo, transformation: { width: 214, height: 60 } })
```

## 3. Pie de página (footer, todas las páginas)

Cinco párrafos centrados (el primero alineado a la derecha):

1. `Página {CURRENT} de {TOTAL_PAGES}` — alineado a la derecha, con los números en negrita.
2. Nombre de la dependencia en mayúsculas, negrita, centrado (p. ej. `PROCURADURÍA REGIONAL DE INSTRUCCIÓN DE CASANARE`). **Ajustar si el auto se proyecta para otra dependencia.**
3. Dirección y PBX, centrado (p. ej. `Calle 7 N.° 22 – 85 Yopal, Casanare | PBX (601) 5878750 Ext.: 80101, 80112`).
4. Correo y sitio web, centrado.
5. Línea diminuta de control documental: `Proceso: Documental | Código: DO-F-23 | Versión: 3 | Fecha: 24/10/2025` (código de la dependencia; verificar si cambia).

## 4. Tabla de datos del proceso (antes de "Yopal, Casanare,")

Tabla de 2 columnas (2263 / 6521 dxa), **borde exterior únicamente** (sin líneas horizontales internas), etiquetas y valores en **negrita**, tamaño 24 (12pt), fuente Arial. Filas típicas: `Dependencia`, `Radicación n.°`, `Disciplinado(s)`, `Cargo y Entidad`, `Origen` (o `Quejoso`), `Fecha` (del informe/queja), `Fecha hechos`, `Asunto`.

Después de la tabla: `Yopal, Casanare, [fecha]` (sin numeral, texto libre) — en el modelo real la fecha se deja pendiente hasta el momento de la firma.

## 5. Tipografía general del cuerpo

**Arial**, tamaño 24 (12pt) en medios-punto, párrafos justificados (`AlignmentType.JUSTIFIED`), interlineado ~300 (1.25), espacio posterior 200 twips.

## 6. Numeración de secciones — lista multinivel con reinicio automático

Los títulos NO se numeran a mano: se usa una lista multinivel de Word (`numbering.config`) de 3 niveles que reinicia automáticamente el contador hijo cada vez que el padre avanza — así "3." (CONSIDERACIONES) va seguido de "3.1.", "3.2." y, dentro de "3.2.", de "3.2.1.", "3.2.2.", sin tocar contadores a mano.

```js
numbering: {
  config: [{
    reference: "legal",
    levels: [
      { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START,
        suffix: LevelSuffix.SPACE, style: { paragraph: { indent: { left: 0 } } } },
      { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.START,
        suffix: LevelSuffix.SPACE, style: { paragraph: { indent: { left: 460, hanging: 460 } } } },
      { level: 2, format: LevelFormat.DECIMAL, text: "%1.%2.%3.", alignment: AlignmentType.START,
        suffix: LevelSuffix.SPACE, style: { paragraph: { indent: { left: 640, hanging: 640 } } } },
    ],
  }],
}
```

Nivel 0 → títulos principales, **centrados**, negrita, mayúsculas (`1. ASUNTO POR TRATAR`, `2. ANTECEDENTES Y TRÁMITE PROCESAL`, `3. CONSIDERACIONES DEL DESPACHO`, `4. RESUELVE`). El contador de nivel 0 se comparte con "RESUELVE" y con "NOTIFÍQUESE, COMUNÍQUESE Y CÚMPLASE" **no lleva numeral** (es un párrafo centrado aparte, sin `numPr`).

Nivel 1 → subtítulos temáticos dentro de cada sección (`2.1. Origen de la investigación disciplinaria`, `3.1. Competencia`), alineados a la izquierda, negrita, con sangría francesa.

Nivel 2 → solo cuando se requiere un tercer nivel (p. ej. dentro de "Valoración probatoria": `3.5.1. Hechos acreditados`, `3.5.2. Hechos no acreditados`, `3.5.3. Interpretaciones e hipótesis`).

**Importante (gotcha de LibreOffice/Word):** si el párrafo de nivel 0 se centra con `alignment: CENTER` pero el nivel usa el `suffix` por defecto (`tab`), el número queda separado del título por un salto de tabulación grande y el conjunto no se ve centrado como bloque. Usa siempre `suffix: LevelSuffix.SPACE` en los tres niveles para que el numeral quede pegado al título por un simple espacio.

Antecedentes: en vez de una lista plana de fechas (2.1, 2.2, 2.3 sin título propio), agrupa los hechos procesales en subtítulos temáticos de nivel 1 (p. ej. "Origen de la investigación", "Apertura de la investigación", "Nulidad y prórroga", "Pruebas testimoniales practicadas", etc.), cada uno con uno o varios párrafos narrativos — así se ve en el modelo real.

## 7. Notas al pie reales (no citas entre paréntesis)

Las referencias a piezas del expediente (autos, certificaciones, actas de testimonio, oficios) van en **notas al pie de Word auténticas** (`FootnoteReferenceRun`), no como texto entre paréntesis dentro del párrafo. El modelo real cita además folios (`Fl. X a Y`) cuando el expediente físico foliado está a la vista — **solo inclúyelos si efectivamente se cuenta con la foliación**; si no se tiene certeza del folio exacto, cita el acto procesal por número y fecha únicamente y no inventes el folio.

### 7.1 Jerarquía de confiabilidad del folio (aplícala siempre que cites folios)

No todas las fuentes de un número de folio tienen el mismo valor para incluirlo en una providencia. Al construir las notas al pie de la valoración probatoria (o de cualquier acápite), clasifica cada folio disponible en una de estas categorías y trátalo en consecuencia:

1. **Confiable — autocita del propio despacho, ya impresa con OCR limpio.** Cuando un auto anterior del mismo expediente, ya firmado e impreso, cita en su propio texto (no manuscrito) el folio de un acto anterior (p. ej., un auto de nulidad que al referirse al auto de apertura pone en nota al pie "Fl. 9 a 13"), ese dato es fiable: proviene del propio despacho, fue tipografiado y su OCR no admite ambigüedad. Cítalo con seguridad, indicando entre paréntesis el auto del que se tomó (p. ej. "según se indica en el Auto N.° 00152 de 17 de febrero de 2025").
2. **Razonablemente confiable — organización física/documental hecha por la propia dependencia, no una lectura de sello manuscrito.** P. ej., si un CD o medio digital fue guardado por la dependencia en una carpeta rotulada "CD FL 81", ese rótulo es un dato organizacional fiable (no requiere que tú "leas" un sello), pero adviértelo como tal en la nota (de dónde proviene la inferencia) y déjalo sujeto a confirmación del despacho antes de la firma.
3. **NO confiable — lectura propia de un sello de foliación manuscrito sobre el PDF escaneado.** Nunca cites como cierto un folio que obtuviste leyendo tú mismo (por recorte de imagen u OCR) un sello o número manuscrito en la esquina de una página escaneada. Esta lectura es propensa a error (un mismo sello puede leerse de dos formas distintas en dos intentos) y no debe presentarse como dato cierto en un documento con valor jurídico. Si es la única fuente disponible, **omite el folio** y cita el documento por su identidad cierta (tipo, autor, fecha, nombre de archivo), dejando constancia expresa de que el folio está "pendiente de verificación/asignación" — nunca inventes el número ni lo redondees "a ojo".

Para archivos aportados como piezas sueltas fuera del cuaderno foliado (transcripciones de declaraciones, certificaciones, registros, actas) — que normalmente no tienen folio hasta que se incorporan físicamente al expediente — cítalos siempre por su identificación completa (tipo de documento, declarante o expedidor, fecha, nombre exacto del archivo fuente) y señala expresamente que el folio queda pendiente de asignación en el cuaderno físico.

```js
// registro de notas al pie
let fnCounter = 0;
const footnotes = {};
function addFootnote(text) {
  fnCounter += 1;
  footnotes[fnCounter] = { children: [new Paragraph({ children: [new TextRun({ text, size: 18, font: FONT })] })] };
  return fnCounter;
}
// ... new Document({ footnotes, sections: [...] })
```

La marca de nota va pegada al carácter anterior (sin espacio antes) y seguida de un espacio antes de continuar el texto — cuidado con no invertir ese espaciado (ver helper `runsFor` en `scripts/plantilla_auto.js`, que ya resuelve esto automáticamente).

## 8. Parte resolutiva — sangría francesa con rótulo en negrita

Cada numeral del "RESUELVE" (`PRIMERO`, `SEGUNDO`, `TERCERO`...) es un párrafo con sangría francesa (`indent: { left: 1410, hanging: 1410 }`), rótulo en negrita seguido de tabulación:

```js
function resuelveItem(label, parts) {
  return new Paragraph({
    indent: { left: 1410, hanging: 1410 },
    alignment: AlignmentType.JUSTIFIED,
    tabStops: [{ type: "left", position: 1410 }],
    children: [
      new TextRun({ text: label + ":", bold: true, size: 24, font: FONT }),
      new TextRun({ text: "\t", size: 24, font: FONT }),
      ...runsFor(parts),
    ],
  });
}
```

Cuando un numeral requiere tabla de notificación (sujeto procesal / datos de notificación), la tabla se inserta **con sangría izquierda igual a la del numeral** (`indent: { size: 1410, type: WidthType.DXA }` en `Table`), 2 columnas, con bordes completos (a diferencia de la tabla de datos del proceso, que solo lleva borde exterior), encabezado centrado en negrita.

## 9. Cierre y bloque de firma

- `NOTIFÍQUESE, COMUNÍQUESE Y CÚMPLASE` — centrado, negrita, sin numeral.
- Nombre del procurador/a que suscribe — centrado, negrita.
- Cargo — centrado, tamaño normal.
- Bloque final en fuente **muy pequeña** (tamaño 16 en medios-punto = 8pt), alineado a la izquierda, con tabulación entre el rótulo y el valor:

```
Proyecto: <nombre de quien proyecta> / <cargo>
Reviso:   <nombre de quien revisa, si ya se conoce>
Aprobó:   <nombre de quien aprueba, si ya se conoce>
```

## 10. Convención propia para minutas de trabajo (no está en el modelo institucional)

Cuando el auto se entrega como **proyecto** (borrador pendiente de verificación por el titular del despacho, no listo para firma), resalta en naranja los datos que aún deben confirmarse directamente en el expediente físico, con un párrafo de borde izquierdo naranja y fondo claro:

```js
function bracket(text) {
  return new Paragraph({
    shading: { type: ShadingType.CLEAR, fill: "FCE4D6" },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: "C55A11" } },
    children: [new TextRun({ text: "[VERIFICAR ANTES DE FIRMAR] " + text, size: 18, font: FONT, italics: true, color: "833C00" })],
  });
}
```

Esta convención no proviene del modelo institucional (que es un documento ya suscrito, sin pendientes) — es una capa de anotación propia para el proceso de proyección. Elimínala (o resuelve cada corchete) antes de considerar el documento listo para la firma del procurador/a.

## 11. Verificación obligatoria

Tras generar el `.docx`, conviértelo a PDF y revisa **todas** las páginas como imágenes (protocolo estándar de la skill `docx`). Presta atención particular a: que los numerales de nivel 0 queden pegados al título como un bloque centrado (no separados por un salto grande), que las notas al pie aparezcan en la página correcta con el separador estándar, y que la tabla de notificación conserve la sangría del numeral "SEGUNDO".
