import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://easyhiresg.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Origin': 'https://easyhiresg.com'
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Forward authentication headers
            if (req.headers.cookie) {
              proxyReq.setHeader('Cookie', req.headers.cookie);
            }
            
            // Set secure CORS headers for preflight requests
            if (req.method === 'OPTIONS') {
              const allowedOrigins = [
                'http://localhost:5173', // Vite dev server
                'http://localhost:5174', // Alternative dev port
                'http://localhost:3000', // Backend dev
                'https://easyhiresg.com',    // Production
                'https://www.easyhiresg.com' // Production www
              ];

              const origin = req.headers.origin;
              const isAllowedOrigin = allowedOrigins.includes(origin);

              if (isAllowedOrigin) {
                res.setHeader('Access-Control-Allow-Origin', origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
              } else {
                res.setHeader('Access-Control-Allow-Origin', 'null');
                res.setHeader('Access-Control-Allow-Credentials', 'false');
              }

              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
              res.setHeader('Access-Control-Max-Age', '3600');
              res.statusCode = 200;
              res.end();
              return;
            }
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Add secure CORS headers to all responses
            const allowedOrigins = [
              'http://localhost:5173', // Vite dev server
              'http://localhost:5174', // Alternative dev port
              'http://localhost:3000', // Backend dev
              'https://easyhiresg.com',    // Production
              'https://www.easyhiresg.com' // Production www
            ];

            const origin = req.headers.origin;
            const isAllowedOrigin = allowedOrigins.includes(origin);

            if (isAllowedOrigin) {
              proxyRes.headers['Access-Control-Allow-Origin'] = origin;
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
            } else {
              proxyRes.headers['Access-Control-Allow-Origin'] = 'null';
              proxyRes.headers['Access-Control-Allow-Credentials'] = 'false';
            }

            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';

            // Add security headers
            proxyRes.headers['X-Content-Type-Options'] = 'nosniff';
            proxyRes.headers['X-Frame-Options'] = 'DENY';
            proxyRes.headers['X-XSS-Protection'] = '1; mode=block';
            proxyRes.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
            proxyRes.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=()';

            // Content Security Policy (restrictive but allows necessary resources)
            proxyRes.headers['Content-Security-Policy'] = [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://easyhiresg.com https://maps.googleapis.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ');

            // HTTP Strict Transport Security (for HTTPS)
            if (req.headers['x-forwarded-proto'] === 'https' || req.secure) {
              proxyRes.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
            }
          });
        }
      }
    }
  }
})
