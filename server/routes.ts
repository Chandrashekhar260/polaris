import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import { createProxyMiddleware } from "http-proxy-middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy all HTTP API requests to Python backend
  // This handles JSON, multipart/form-data, and all other content types
  const PYTHON_BACKEND_HTTP = process.env.PYTHON_BACKEND_HTTP || 'http://localhost:8000';
  
  // Create proxy that forwards /api/* to backend's /api/*
  const apiProxy = createProxyMiddleware({
    target: PYTHON_BACKEND_HTTP,
    changeOrigin: true,
    ws: false, // WebSocket handled separately below
    pathRewrite: {
      '^/': '/api/'  // app.use('/api') strips /api, so we add it back
    },
    onError: (err: Error, req: any, res: any) => {
      console.error('❌ API Proxy Error:', err.message);
      if (res && typeof res.writeHead === 'function') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Backend connection error', 
          message: err.message 
        }));
      }
    }
  });
  
  // Apply proxy middleware to /api routes, but skip WebSocket upgrade requests
  app.use('/api', (req, res, next) => {
    if (req.headers.upgrade === 'websocket') {
      return next();
    }
    return apiProxy(req, res, next);
  });

  const httpServer = createServer(app);

  // WebSocket proxy to Python backend
  // This allows WebSocket connections on the same port as the Node.js server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/ws/stream'
  });

  const PYTHON_BACKEND_WS = process.env.PYTHON_BACKEND_WS || 'ws://localhost:8000/api/ws/stream';

  wss.on('connection', (clientWs: WebSocket, req) => {
    console.log('🔌 WebSocket client connected to Node.js server');
    
    // Create connection to Python backend
    const backendWs = new WebSocket(PYTHON_BACKEND_WS);
    let backendConnected = false;
    
    // Wait for backend connection before forwarding messages
    backendWs.on('open', () => {
      console.log('✅ Connected to Python backend WebSocket');
      backendConnected = true;
    });
    
    // Forward messages from client to Python backend
    clientWs.on('message', (data) => {
      if (backendConnected && backendWs.readyState === WebSocket.OPEN) {
        backendWs.send(data);
      } else {
        console.warn('⚠️ Backend not connected, dropping client message');
      }
    });
    
    // Forward messages from Python backend to client
    backendWs.on('message', (data) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        try {
          const message = JSON.parse(data.toString());
          console.log('📤 Forwarding message to frontend:', message.type);
          clientWs.send(data);
        } catch (e) {
          // If not JSON, send as-is
          console.log('📤 Forwarding raw message to frontend');
          clientWs.send(data);
        }
      } else {
        console.warn('⚠️ Client not connected, dropping backend message');
      }
    });
    
    // Handle errors
    backendWs.on('error', (error) => {
      console.error('❌ Python backend WebSocket error:', error);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'error',
          message: 'Backend connection error'
        }));
      }
    });
    
    clientWs.on('error', (error) => {
      console.error('❌ Client WebSocket error:', error);
    });
    
    // Clean up on close
    clientWs.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
      backendWs.close();
    });
    
    backendWs.on('close', () => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
    });
    
  });

  console.log('✅ WebSocket proxy configured at /api/ws/stream ->', PYTHON_BACKEND_WS);

  return httpServer;
}
