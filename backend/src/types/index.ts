// ─── AI Service Types ─────────────────────────────────────────────────────────

export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface AiDefect {
  type: string;
  diseaseName?: string;
  confidence: number;
  areaPercentage?: number;
  severity?: string;
  treatment?: string;
  storageAdvice?: string;
  bbox?: BoundingBox;
}

export interface AiPredictionResponse {
  grade: 'A' | 'B' | 'C' | 'REJECTED';
  score: number;            // 0–100
  size: string;             // 'Small' | 'Medium' | 'Large'
  freshness: 'HIGH' | 'MEDIUM' | 'LOW';
  damage: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: 'ACCEPT' | 'CONDITIONAL_ACCEPT' | 'REJECT';
  defects: AiDefect[];
  processedImage: string;  // S3 URL or base64
  modelVersion: string;
  processingTimeMs: number;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  village?: string | null;
  district?: string | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
