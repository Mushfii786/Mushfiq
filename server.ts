import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint for chat about Muhammed Mushfiq
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body; // Array of { role: 'user' | 'model', text: string }
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Format contents for Gemini
      const contents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const systemInstruction = `You are an AI assistant for Muhammed Mushfiq's personal portfolio website. 
Muhammed Mushfiq is a world-class creative designer, UI/UX expert, professional photographer, and frontend developer known for Awwwards-winning digital experiences, stunning cinematic videography, and immersive photography collections.
Your goal is to help visitors learn more about Muhammed, his work, his photography/videography catalog, his skills, booking rates, contact information, and background.
Be friendly, professional, concise, and engaging in your responses. If asked about booking or contact, encourage them to use the contact form on the website or email him directly.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "I'm here to help you learn more about Muhammed Mushfiq's portfolio and creative work!" });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
