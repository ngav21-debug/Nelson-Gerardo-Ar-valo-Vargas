
import React from 'react';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M24 9.5c3.23 0 5.45 1.34 6.67 2.52l4.9-4.9C32.06 4.12 28.31 2.5 24 2.5c-6.68 0-12.35 4.84-14.28 11.33l5.88 4.57C17.22 13.41 20.37 9.5 24 9.5z"/>
    <path fill="#34A853" d="M46.28 24.5c0-1.63-.15-3.2-.42-4.7H24v8.98h12.45c-.54 2.9-2.1 5.38-4.58 7.07l5.88 4.57C42.44 36.37 46.28 31.02 46.28 24.5z"/>
    <path fill="#FBBC05" d="M9.72 28.46c-.5-1.48-.79-3.05-.79-4.69s.29-3.21.79-4.69l-5.88-4.57C2.06 18.25 1.72 21.05 1.72 24c0 2.95.34 5.75 1.95 8.28l5.93-4.57-.08.01z"/>
    <path fill="#EA4335" d="M24 45.5c4.32 0 8.06-1.6 10.74-4.32l-5.88-4.57c-1.4.95-3.24 1.5-5.22 1.5-3.65 0-6.78-2.5-7.92-5.93l-5.88 4.57C11.65 40.66 17.32 45.5 24 45.5z"/>

  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

export const FolderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
);

export const FileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM13 9V3.5L18.5 9H13z" />
    </svg>
);
