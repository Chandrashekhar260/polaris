import { useEffect, useRef, useState, useCallback } from 'react';

// Connect to Node.js server WebSocket proxy (same port as frontend)
// The Node.js server will proxy to Python backend
const WS_URL = import.meta.env.VITE_PYTHON_WS_URL || 
  (typeof window !== 'undefined' 
    ? `ws://${window.location.host}/api/ws/stream` 
    : 'ws://localhost:5000/api/ws/stream');

export interface WebSocketMessage {
  type: 'connected' | 'received' | 'analysis' | 'documentation' | 'recommendations' | 'quiz' | 'error';
  data?: any;
  analysis?: any;
  suggestions?: any[];
  errors?: any[];
  weak_areas?: string[];
  recommendations?: any[];
  quiz?: any;
  focus_areas?: string[];
  message?: string;
  timestamp?: string;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: any) => void;
  error: Error | null;
}

/**
 * Hook for managing WebSocket connection to Python backend
 */
export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    try {
      // Create WebSocket with longer timeout for initial connection
      const ws = new WebSocket(WS_URL);
      
      // Set a timeout for connection (30 seconds)
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout, will retry...');
          ws.close();
        }
      }, 30000);
      
      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connected to Python backend');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data.type, data); // Debug log
          // Normalize message format
          const message: WebSocketMessage = {
            type: data.type || 'unknown',
            ...data, // Include all fields from backend
            data: data.analysis || data.quiz || data.recommendations || data,
            timestamp: data.timestamp
          };
          setLastMessage(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket disconnected', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... (attempt ${reconnectAttempts.current})`);
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    error
  };
}
