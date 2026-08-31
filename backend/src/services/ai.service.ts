import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { config } from '../config/env';
import { AiPredictionResponse } from '../types';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

const aiClient: AxiosInstance = axios.create({
  baseURL: config.ai.serviceUrl,
  timeout: config.ai.timeout,
});

const generateMockPrediction = (): AiPredictionResponse => {
  const rand = Math.random;
  const score = Math.round(rand() * 40 + 55 + rand() * 5);

  let grade: AiPredictionResponse['grade'];
  if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C';
  else grade = 'REJECTED';

  const defects = [
    {
      type: 'Purple Blotch',
      diseaseName: 'Purple Blotch (Alternaria porri)',
      confidence: 0.94,
      areaPercentage: 8.5,
      severity: 'High',
      treatment: 'Spray Mancozeb 75 WP (2.5 g/L) or Tebuconazole 50% + Trifloxystrobin 25% WG (0.6 g/L).',
      storageAdvice: 'Cure onions thoroughly in well-ventilated sheds for 10-14 days before storage.',
      bbox: { xMin: 0.15, yMin: 0.2, xMax: 0.45, yMax: 0.55 },
    },
  ];

  return {
    grade,
    score,
    size: 'Medium (50-65mm)',
    freshness: score >= 80 ? 'HIGH' : score >= 60 ? 'MEDIUM' : 'LOW',
    damage: 'MEDIUM',
    recommendation: grade === 'A' || grade === 'B' ? 'ACCEPT' : 'CONDITIONAL_ACCEPT',
    defects,
    processedImage: '',
    modelVersion: 'YOLO11n-v2.0-mock',
    processingTimeMs: 145,
  };
};

export const aiService = {
  async predict(
    imageBuffer: Buffer,
    mimeType: string,
    originalName: string
  ): Promise<AiPredictionResponse> {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: originalName,
      contentType: mimeType,
    });

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

      logger.info(`YOLO11n AI prediction completed in ${processingTimeMs}ms`, {
        grade: response.data.grade,
        score: response.data.score,
      });

      return { ...response.data, processingTimeMs };
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        logger.warn('AI service unreachable – falling back to YOLO11 mock prediction');
        return generateMockPrediction();
      }
      logger.warn('AI connection fallback activated');
      return generateMockPrediction();
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      await aiClient.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};
