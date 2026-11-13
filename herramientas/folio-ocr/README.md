# Folio OCR

Artefacto web que lee PDF (escaneados o nativos) con OCR en el navegador y entrega:

- **Markdown** con encabezado YAML, marca por página, confianza OCR y aviso en páginas con confianza baja.
- **Word (.docx)** en Arial 12, con marca por página.
- **PDF/A-2b** con la imagen de cada página y capa de texto invisible buscable (XMP, perfil sRGB incrustado, ID de archivo). Validado con veraPDF 1.28 en archivos de prueba.
- **Versión anonimizada** (Markdown, Word y PDF/A) con revisión manual de los datos detectados: personas, documentos de identidad, teléfonos, correos, direcciones, placas, cuentas y, opcionalmente, radicados. En el PDF el tachado se hace sobre la imagen de la página y la capa de texto se reconstruye sin los datos ocultos. Incluye tabla de equivalencias (.csv) aparte, de uso reservado.

Todo el proceso ocurre en el navegador: los PDF no se envían a ningún servidor.

## Archivos de terceros que deben acompañar a `index.html`

No se versionan aquí por tamaño. Se obtienen de npm:

| Ruta publicada | Origen |
| --- | --- |
| `vendor/tesseract-worker.min.js` | `tesseract.js@5.1.1/dist/worker.min.js` |
| `vendor/tesseract-core-simd-lstm.wasm.js`, `vendor/tesseract-core-lstm.wasm.js` | `tesseract.js-core@5.1.1` |
| `vendor/pdf.worker.min.js` | `pdfjs-dist@3.11.174/build/pdf.worker.min.js` |

JSZip 3.10.1 se carga desde cdnjs.
| `lang/spa.traineddata.gz.b64.txt`, `lang/eng.traineddata.gz.b64.txt` | `@tesseract.js-data/{spa,eng}@1.0.0/4.0.0_best_int/*.traineddata.gz`, codificados en base64 (`base64 -w0`) |

Los modelos van en base64 porque el alojamiento de artefactos no sirve `.gz`; `vendor/ocr-worker.js` los decodifica dentro del worker.
