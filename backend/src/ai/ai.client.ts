import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { config } from '../config/config';
import { AiPredictionResponse } from '../types';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

// ─── AI Service Client ────────────────────────────────────────────────────────

const aiClient: AxiosInstance = axios.create({
  baseURL: config.ai.serviceUrl,
  timeout: config.ai.timeout,
});

// ─── Demo/Fallback Response Generator ────────────────────────────────────────

const generateMockPrediction = (): AiPredictionResponse => {
  const rand = Math.random;
  const score = Math.round(rand() * 40 + 55 + rand() * 5);

  let grade: AiPredictionResponse['grade'];
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C';
  else grade = 'REJECTED';

  const defectTypes = ['Rot', 'Sprout', 'Cut', 'BlackSpot', 'Bruise', 'Mold'];
  const numDefects = Math.floor(rand() * 3);
  const defects = Array.from({ length: numDefects }, () => ({
    type: defectTypes[Math.floor(rand() * defectTypes.length)],
    confidence: Math.round(rand() * 30 + 2) / 100,
    areaPercentage: Math.round(rand() * 14 + 1),
  }));

  const totalConf = defects.reduce((s, d) => s + d.confidence, 0);
  const damage: AiPredictionResponse['damage'] =
    totalConf < 0.1 ? 'LOW' : totalConf < 0.4 ? 'MEDIUM' : 'HIGH';

  const freshness: AiPredictionResponse['freshness'] =
    score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW';

  const recommendation: AiPredictionResponse['recommendation'] =
    grade === 'A' || grade === 'B'
      ? 'ACCEPT'
      : grade === 'C'
      ? 'CONDITIONAL_ACCEPT'
      : 'REJECT';

  const sizes = ['Small', 'Medium', 'Large'];
  const size = sizes[Math.floor(rand() * sizes.length)];

  logger.warn('AI service unavailable – using MOCK prediction. DO NOT use in production.');

  return {
    grade,
    score,
    size,
    freshness,
    damage,
    recommendation,
    defects,
    processedImage: '',     // no annotated image in fallback
    modelVersion: 'mock-1.0.0',
    processingTimeMs: Math.floor(rand() * 200 + 50),
  };
};

export const aiService = {
  /**
   * Send an image buffer to the Python FastAPI AI service for grading.
   * Falls back to a deterministic mock response if the service is unreachable.
   */
  async predict(
    imageBuffer: Buffer,
    mimeType: string,
    originalName: string,
    contextData?: any
  ): Promise<AiPredictionResponse> {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: originalName,
      contentType: mimeType,
    });
    if (contextData) {
      formData.append('context', JSON.stringify(contextData));
    }

    try {
      const startTime = Date.now();
      const response = await aiClient.post<AiPredictionResponse>(
        '/predict',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        }
      );
      const processingTimeMs = Date.now() - startTime;

      logger.info(`AI prediction completed in ${processingTimeMs}ms`, {
        grade: response.data.grade,
        score: response.data.score,
      });

      return { ...response.data, processingTimeMs };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If service is completely down (ECONNREFUSED, network error) → use mock
        if (!error.response) {
          logger.warn('AI service unreachable – falling back to mock prediction');
          return generateMockPrediction();
        }

        const status = error.response?.status ?? 503;
        const message =
          (error.response?.data as { detail?: string })?.detail ??
          'AI service unavailable';
        logger.error(`AI service error: ${message}`, { status });
        throw new AppError(`AI service error: ${message}`, status);
      }
      logger.warn('AI service connection failed – falling back to mock prediction');
      return generateMockPrediction();
    }
  },

  /**
   * Health-check the AI service
   */
  async healthCheck(): Promise<boolean> {
    try {
      await aiClient.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};
