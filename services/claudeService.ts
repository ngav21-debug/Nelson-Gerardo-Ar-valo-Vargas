
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.API_KEY!,
  dangerouslyAllowBrowser: true,
});

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

  const fileContext = files
    .map(
      (file) =>
        `---\nNombre del archivo: ${file.name}\nContenido:\n${file.content}\n---`
    )
    .join("\n\n");

  const prompt = `Eres un asistente experto en analizar documentos, similar a NotebookLM. Basándote exclusivamente en el contenido de los siguientes archivos, responde la pregunta del usuario. Si la respuesta no se encuentra en los documentos, indica que no has encontrado la información en los archivos proporcionados.

Contexto de los archivos:
${fileContext}

Pregunta del usuario: "${query}"

Respuesta:`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8096,
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content[0];
    return block.type === "text" ? block.text : "Respuesta no disponible.";
  } catch (error) {
    console.error("Error al consultar la API de Claude:", error);
    return "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.";
  }
};
