import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { executeGeminiAction } from './netlify/functions/gemini.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '256kb' }));

  const handleGeminiRoute = async (req: express.Request, res: express.Response) => {
    try {
      const result = await executeGeminiAction(req.body);
      res.status(result.statusCode).json(result.body);
    } catch (error) {
      console.error('Error en puente Gemini:', error);
      res.status(200).json({
        fallback: true,
        reason: 'SERVER_BRIDGE_ERROR',
        message: 'Usando respaldo local precargado.',
      });
    }
  };

  // Soporta tanto la ruta estándar de Netlify Functions como /api/gemini
  app.post('/.netlify/functions/gemini', handleGeminiRoute);
  app.post('/api/gemini', handleGeminiRoute);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'ENTRE NOS' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ENTRE NOS escuchando en http://0.0.0.0:${PORT}`);
  });
}

startServer();
