
export type EncodingMethod = 'hex' | 'dec' | 'named' | 'percent' | 'mixed' | 'custom';

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warn';
}

export interface EncodingResult {
  original: string;
  encoded: string;
}

export interface User {
  id: string;
  name: string;
  password?: string; // Made optional for security reasons on client-side
  avatar: string; // URL or letter
  status: 'online' | 'offline';
}

export interface ChatMessage {
    id: number;
    author: User;
    text: string;
    timestamp: string;
}
