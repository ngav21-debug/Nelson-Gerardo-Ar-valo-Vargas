
export interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  iconLink: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  isLoading?: boolean;
}
