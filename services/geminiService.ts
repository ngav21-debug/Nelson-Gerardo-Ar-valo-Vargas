
import { GoogleGenAI } from "@google/genai";

// La clave de API de Gemini se espera en process.env.API_KEY
// Asegúrate de que esta variable de entorno esté configurada en tu entorno de ejecución.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface FileData {
    name: string;
    content: string;
}

export const queryFiles = async (files: FileData[], query: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    if (files.length === 0) {
        return "Por favor, selecciona una carpeta con archivos para poder hacer una consulta.";
    }

    const fileContext = files.map(file => 
        `---
Nombre del archivo: ${file.name}
Contenido:
${file.content}
---`
    ).join('\n\n');

    const prompt = `
    Eres un asistente experto en analizar documentos. Basándote exclusivamente en el contenido de los siguientes archivos, responde la pregunta del usuario. Si la respuesta no se encuentra en los documentos, indica que no has encontrado la información en los archivos proporcionados.

    Contexto de los archivos:
    ${fileContext}

    Pregunta del usuario: "${query}"

    Respuesta:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error al consultar la API de Gemini:", error);
        return "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.";
    }
};
