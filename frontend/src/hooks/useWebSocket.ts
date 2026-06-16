import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export interface WebSocketEvent {
  type: string;
  data: any;
}

export const useWebSocket = () => {
  const { user } = useAuth();
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<any>(null);

  const connect = useCallback(() => {
    if (!user?.id || ws.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // Dynamically resolve wsUrl from the configured API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'https://certforge-ai.onrender.com/api/v1';
    let wsUrl: string;
    
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      const url = new URL(apiUrl);
      const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      wsUrl = `${wsProtocol}//${url.host}${url.pathname}/ws/${user.id}`;
    } else {
      const host = window.location.host;
      wsUrl = `${protocol}//${host}/api/v1/ws/${user.id}`;
    }

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setLastEvent(parsed);
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      // Attempt reconnect
      reconnectTimeout.current = setTimeout(connect, 3000);
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket Error', err);
      ws.current?.close();
    };
  }, [user?.id]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [connect]);

  return { lastEvent, isConnected };
};
