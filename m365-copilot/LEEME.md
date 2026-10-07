# Copilot de Microsoft 365: tres agentes

Cada carpeta es un agente. Las instrucciones (`instrucciones.txt`) tienen menos de 8.000 caracteres (5.300 a 5.800) y los archivos de `conocimiento/` están en Word.

| Carpeta | Agente | Instrucciones | Archivos de conocimiento |
|---|---|---|---|
| 01-valoracion-probatoria | Valoración probatoria disciplinaria | 5.333 caracteres | 4 |
| 02-evaluacion-investigacion | Evaluación de la investigación disciplinaria | 5.759 caracteres | 1 |
| 03-derecho-disciplinario-pgn | Derecho disciplinario PGN | 5.733 caracteres | 7 |

## Pasos (los nombres de los menús pueden variar)
1. En Microsoft 365 Copilot, crea un agente nuevo (Agent Builder / «Crear agente»).
2. Pon el nombre de la tabla y pega el contenido de `instrucciones.txt` en el campo de instrucciones.
3. Sube los archivos de `conocimiento/` de esa carpeta como fuentes de conocimiento del agente.
4. Prueba con un caso conocido y comprueba que cite solo providencias de «jurisprudencia_verificada» (agente 01) y que no invente artículos.

## Qué debes saber
- **Sin probar en Copilot:** no he podido probar estos agentes. Los textos son los mismos de las habilidades de Claude y Gemini, condensados.
- **Condensación:** el agente 03 era el más largo (20.000 caracteres); su detalle está en el archivo «protocolos_derecho_disciplinario». Si Copilot no recupera ese detalle, indícale que lo consulte.
- **Archivos de conocimiento:** si tu cuenta limita su tamaño o el número de archivos, sube primero los más importantes: en el agente 01, «reglas_por_tema» y «jurisprudencia_verificada»; en el agente 03, «protocolos_derecho_disciplinario» y «competencia».
- **Agentes separados:** un agente de Copilot no puede invocar a otro como hacen las habilidades de Claude. Las frases que remiten al «agente de valoración probatoria» te indican cuándo cambiar de agente.
- **Sin archivos generados:** estos agentes entregan los autos como texto para pegar en Word; el membrete y el logotipo los agregas tú.
- **Vigencia:** la copia de la Ley 1952 usada no incluye cambios posteriores a 2021 ni los arts. 223 y ss.; verifica vigencia y numeración en el texto oficial antes de firmar.
- **Datos institucionales:** estos archivos contienen jurisprudencia y normas públicas; no incluyen datos de expedientes. Si tu entidad restringe subir contenido a agentes, consúltalo con tu administrador.
