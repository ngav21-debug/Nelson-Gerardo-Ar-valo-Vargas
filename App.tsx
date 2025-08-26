
import React, { useState, useEffect, useCallback } from 'react';
import { GOOGLE_CLIENT_ID, GOOGLE_API_KEY, SCOPES } from './config';
import type { GoogleFile, ChatMessage } from './types';
import { queryFiles } from './services/geminiService';
import { ChatInterface } from './components/ChatInterface';
import { FileList } from './components/FileList';
import { GoogleIcon, FolderIcon } from './components/icons';

// Declarations for Google APIs loaded from scripts
declare global {
  interface Window {
    gapi: any;
    google: any;
    tokenClient: any;
  }
}

const App: React.FC = () => {
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [gapiReady, setGapiReady] = useState(false);
  const [pickerApiReady, setPickerApiReady] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | null>(null);
  const [files, setFiles] = useState<GoogleFile[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, {name: string, content: string}>>({});
  
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Initialize GAPI and GSI clients
  useEffect(() => {
    const gapiScript = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    gapiScript?.addEventListener('load', () => {
        window.gapi.load('client:picker', () => {
            window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest')
                .then(() => setGapiReady(true));
            setPickerApiReady(true);
        });
    });

    const gsiScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    gsiScript?.addEventListener('load', () => {
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: (tokenResponse: any) => {
                if (tokenResponse && tokenResponse.access_token) {
                    window.gapi.client.setToken({ access_token: tokenResponse.access_token });
                    setIsAuthenticated(true);
                    setChatHistory([{ id: 'init', sender: 'system', text: '¡Conexión exitosa! Ahora selecciona una carpeta.' }]);
                }
            },
        });
        setTokenClient(client);
    });
  }, []);

  const handleAuthClick = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  }, [tokenClient]);

  const fetchFileContent = async (file: GoogleFile): Promise<{name: string; content: string} | null> => {
      try {
          let response;
          if (file.mimeType === 'application/vnd.google-apps.document') {
              response = await window.gapi.client.drive.files.export({
                  fileId: file.id,
                  mimeType: 'text/plain',
              });
              return { name: file.name, content: response.body };
          } else {
              response = await window.gapi.client.drive.files.get({
                  fileId: file.id,
                  alt: 'media',
              });
              return { name: file.name, content: response.body };
          }
      } catch (err) {
          console.error(`Error fetching content for ${file.name}:`, err);
          return null; // Ignore files that can't be read
      }
  };

  const pickerCallback = useCallback(async (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const folder = data.docs[0];
      setSelectedFolder({ id: folder.id, name: folder.name });
      setIsLoadingFiles(true);
      setFiles([]);
      setFileContents({});
      setChatHistory(prev => [...prev, {id: 'folder-select', sender: 'system', text: `Carpeta '${folder.name}' seleccionada. Analizando archivos...`}]);

      try {
        const response = await window.gapi.client.drive.files.list({
          q: `'${folder.id}' in parents and (mimeType='text/plain' or mimeType='text/markdown' or mimeType='application/vnd.google-apps.document') and trashed=false`,
          fields: 'files(id, name, mimeType, iconLink)',
        });
        
        const fileList: GoogleFile[] = response.result.files || [];
        setFiles(fileList);

        if(fileList.length > 0) {
            const contentPromises = fileList.map(fetchFileContent);
            const contents = await Promise.all(contentPromises);
            const newFileContents: Record<string, {name: string, content: string}> = {};
            contents.forEach((content, index) => {
                if (content) {
                    newFileContents[fileList[index].id] = content;
                }
            });
            setFileContents(newFileContents);
            setChatHistory(prev => [...prev, {id: 'files-ready', sender: 'system', text: `Análisis completado. ¡Ya puedes hacer preguntas sobre los ${Object.keys(newFileContents).length} archivos encontrados!`}]);
        } else {
             setChatHistory(prev => [...prev, {id: 'no-files', sender: 'system', text: `No se encontraron archivos de texto compatibles en esta carpeta.`}]);
        }
      } catch (err) {
        console.error("Error listing files:", err);
        setError("No se pudieron cargar los archivos. Revisa los permisos e inténtalo de nuevo.");
      } finally {
        setIsLoadingFiles(false);
      }
    }
  }, []);

  const handlePickerClick = useCallback(() => {
    if (pickerApiReady && gapiReady) {
      const view = new window.google.picker.View(window.google.picker.ViewId.FOLDERS);
      view.setMimeTypes("application/vnd.google-apps.folder");
      const picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .setAppId(GOOGLE_CLIENT_ID.split('-')[0])
        .setOAuthToken(window.gapi.client.getToken().access_token)
        .addView(view)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  }, [pickerApiReady, gapiReady, pickerCallback]);
  
  const handleSendMessage = async (message: string) => {
      const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: message };
      const aiLoadingMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: '', isLoading: true };

      setChatHistory(prev => [...prev, userMessage, aiLoadingMessage]);
      setIsQuerying(true);

      try {
          const filesData = Object.values(fileContents);
          const aiResponseText = await queryFiles(filesData, message);
          const aiResponseMessage: ChatMessage = { id: aiLoadingMessage.id, sender: 'ai', text: aiResponseText };
          
          setChatHistory(prev => prev.map(msg => msg.id === aiLoadingMessage.id ? aiResponseMessage : msg));
      } catch (err) {
          console.error(err);
          const errorMessage: ChatMessage = { id: aiLoadingMessage.id, sender: 'ai', text: "Hubo un error al contactar a la IA." };
          setChatHistory(prev => prev.map(msg => msg.id === aiLoadingMessage.id ? errorMessage : msg));
      } finally {
          setIsQuerying(false);
      }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 font-sans bg-grid-gray-700/[0.2]">
       <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 pointer-events-none"></div>
      <div className="w-full max-w-4xl z-10">
        <header className="text-center my-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Asistente de Consulta de Drive
          </h1>
          <p className="text-gray-400 mt-2">Hazle preguntas a tus documentos con el poder de Gemini</p>
        </header>

        <main className="flex flex-col items-center">
            <div className="flex space-x-4">
                {!isAuthenticated ? (
                    <button
                        onClick={handleAuthClick}
                        disabled={!tokenClient}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        <GoogleIcon className="w-6 h-6 mr-3" />
                        Conectar con Google Drive
                    </button>
                ) : (
                    <button
                        onClick={handlePickerClick}
                        disabled={!gapiReady || !pickerApiReady}
                        className="flex items-center justify-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        <FolderIcon className="w-6 h-6 mr-3" />
                        {selectedFolder ? 'Cambiar Carpeta' : 'Seleccionar Carpeta'}
                    </button>
                )}
            </div>
            
            {error && <p className="text-red-400 mt-4">{error}</p>}
            
            <FileList files={files} isLoading={isLoadingFiles} selectedFolder={selectedFolder} />

            <ChatInterface 
                messages={chatHistory} 
                onSendMessage={handleSendMessage} 
                isQuerying={isQuerying}
                isReady={!!selectedFolder && !isLoadingFiles && files.length > 0}
            />
        </main>
      </div>
    </div>
  );
};

export default App;
