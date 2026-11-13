import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  buildGeminiPrompt,
  clampChaosLevel,
  generateFallbackExcuse,
  isValidSituation,
  isValidTarget,
} from './src/utils/excuses.ts';
import type { ChaosLevel, SituationOption, TargetOption } from './src/utils/excuses.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateExcuseWithAI(
  target: TargetOption,
  situation: SituationOption,
  chaosLevel: ChaosLevel
): Promise<{ excuse: string; source: 'gemini' | 'fallback' }> {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      excuse: generateFallbackExcuse(target, situation, chaosLevel),
      source: 'fallback',
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: buildGeminiPrompt(target, situation, chaosLevel),
      config: {
        systemInstruction:
          'You are Excuse Generator 3000, a comedic genius and master procrastinator. Craft sharp, hilarious, memorable first-person excuses tailored to the exact target, situation, and chaos level. Keep every excuse between 2 and 4 punchy sentences. Never output markdown, quotes, or disclaimers.',
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const text = response.text?.trim().replace(/^["']|["']$/g, '');
    if (text && text.length > 15) {
      return { excuse: text, source: 'gemini' };
    }
  } catch (error) {
    console.warn('Gemini excuse generation fell back to dynamic templates:', error);
  }

  return {
    excuse: generateFallbackExcuse(target, situation, chaosLevel),
    source: 'fallback',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.post('/api/generate-excuse', async (req, res) => {
    const { target, situation, chaosLevel } = req.body ?? {};

    if (!isValidTarget(target) || !isValidSituation(situation)) {
      res.status(400).json({
        error: 'Please select a valid target and situation before generating an excuse.',
      });
      return;
    }

    const level = clampChaosLevel(chaosLevel);
    const result = await generateExcuseWithAI(target, situation, level);
    res.json({
      excuse: result.excuse,
      source: result.source,
      target,
      situation,
      chaosLevel: level,
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Excuse Generator 3000 listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
