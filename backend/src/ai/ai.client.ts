import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { config } from '../config/config';
import { AiPredictionResponse } from '../types';
import { logger } from '../utils/logger';
import { AppError, AIServiceError } from '../utils/errors';

// ─── AI Service Client ────────────────────────────────────────────────────────

const aiClient: AxiosInstance = axios.create({
  baseURL: config.ai.serviceUrl,
  timeout: config.ai.timeout,
});

// ─── Demo/Fallback Response Generator (Removed) ──────────────────────────────

export const aiService = {
  /**
   * Send an image buffer to the Python FastAPI AI service for grading.
   * Throws an error if the service is unreachable.
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
        // If service is completely down (ECONNREFUSED, network error)
        if (!error.response) {
          logger.error('AI service unreachable – throwing AIServiceError');
          throw new AIServiceError();
        }

        const status = error.response?.status ?? 503;
        const message =
          (error.response?.data as { detail?: string })?.detail ??
          'AI service unavailable';
        logger.error(`AI service error: ${message}`, { status });
        throw new AIServiceError(`AI service error: ${message}`);
      }
      logger.error('AI service connection failed – throwing AIServiceError');
      throw new AIServiceError();
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
