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

export interface OnionAnalysis {
  id: string;
  bbox: BoundingBox;
  size: string;
  qualityClass: string;
  disease?: string;
  diseaseConfidence: number;
  severity: string;
  grade: string;
}

export interface BatchQualityReport {
  totalOnions: number;
  healthyCount: number;
  damagedCount: number;
  rottenCount: number;
  sproutedCount: number;
  undersizedCount: number;
  gradeAPercentage: number;
  ursPercentage: number;
  qualityScore: number;
  primaryDiseaseDetected?: string;
  overallRiskLevel: string;
  recommendations: string[];
}

export interface AiPredictionResponse {
  qualityGatePassed: boolean;
  qualityGateMessage: string;
  batchReport?: BatchQualityReport;
  onions: OnionAnalysis[];
  processedImage?: string;
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
