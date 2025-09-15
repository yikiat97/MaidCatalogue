import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://yikiat.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Origin': 'https://yikiat.com'
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Forward authentication headers
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie);
            }
            
            // Set proper CORS headers for preflight requests
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
              res.setHeader('Access-Control-Allow-Credentials', 'true');
              res.setHeader('Access-Control-Max-Age', '3600');
              res.statusCode = 200;
              res.end();
              return;
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Add CORS headers to all responses
            proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
            proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
          });
        }
      }
    }
  }
})
