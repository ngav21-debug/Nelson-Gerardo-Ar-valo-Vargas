
import React from 'react';
import type { GoogleFile } from '../types';

interface FileListProps {
  files: GoogleFile[];
  isLoading: boolean;
  selectedFolder: { id: string; name: string } | null;
}

export const FileList: React.FC<FileListProps> = ({ files, isLoading, selectedFolder }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mt-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-cyan-300 mb-2">Cargando archivos de '{selectedFolder?.name}'...</h3>
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-300"></div>
        </div>
      </div>
    );
  }

  if (!selectedFolder) return null;

  return (
    <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mt-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-cyan-300 mb-3">Archivos en '{selectedFolder.name}'</h3>
      {files.length > 0 ? (
        <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {files.map((file) => (
            <li key={file.id} className="flex items-center bg-gray-700/50 p-2 rounded-md">
              <img src={file.iconLink} alt="file icon" className="w-5 h-5 mr-3" />
              <span className="text-gray-300 truncate">{file.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No se encontraron archivos de texto compatibles en esta carpeta.</p>
      )}
    </div>
  );
};
