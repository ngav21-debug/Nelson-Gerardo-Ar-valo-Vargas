# OCR de PDF

Convierte PDF escaneados en texto (.txt) y en PDF con texto buscable (.pdf).
Todo corre en tu navegador: los archivos no se suben a ningún servidor.

## Cómo abrirla

La página necesita un servidor local (no sirve abrir `index.html` con doble clic).

1. Abre una terminal dentro de esta carpeta (`ocr-pdf`).
2. Ejecuta:
   ```
   python3 -m http.server 8000
   ```
   En Windows puede ser `python -m http.server 8000`.
3. Abre en el navegador: http://localhost:8000

## Contenido

- `index.html`: la aplicación.
- `vendor/`: librerías y datos de idioma incluidos, sin depender de internet:
  - pdf.js 3.11.174 (lectura y renderizado de PDF), Apache-2.0.
  - Tesseract.js 5.1.1 y tesseract.js-core 5.1.1 (OCR), Apache-2.0.
  - pdf-lib 1.17.1 (unión de páginas), MIT.
  - Datos de idioma `eng` y `spa` de Tesseract (`4.0.0_best_int`), Apache-2.0.
