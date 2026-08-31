export type Role = 'FARMER' | 'PROCUREMENT_OFFICER' | 'ADMIN';
export type Grade = 'A' | 'B' | 'C' | 'REJECTED';
export type FreshnessLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DamageLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RecommendationStatus = 'ACCEPT' | 'CONDITIONAL_ACCEPT' | 'REJECT';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  village?: string | null;
  district?: string | null;
}

export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface Defect {
  id?: string;
  defectType: string;
  diseaseName?: string | null;
  confidence: number;
  areaPercentage?: number | null;
  severity?: 'Low' | 'Medium' | 'High' | 'Severe' | string | null;
  treatment?: string | null;
  storageAdvice?: string | null;
  xMin?: number | null;
  yMin?: number | null;
  xMax?: number | null;
  yMax?: number | null;
  bbox?: BoundingBox;
}

export interface Certificate {
  id: string;
  analysisId: string;
  certificateNumber: string;
  qrCode?: string | null;
  pdfUrl?: string | null;
  issuedAt: string;
}

export interface OnionAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  processedImageUrl?: string | null;
  grade: Grade;
  score: number;
  size: string;
  freshness: FreshnessLevel;
  damageLevel: DamageLevel;
  recommendation: RecommendationStatus;
  aiModelVersion: string;
  processingTimeMs?: number | null;
  createdAt: string;
  defects: Defect[];
  certificate?: Certificate | null;
}

export interface ProcurementCenter {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
