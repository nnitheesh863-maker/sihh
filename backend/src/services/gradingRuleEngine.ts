export type OnionGrade = 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECT';

export interface OnionAssessmentInput {
  diameterMm: number;
  weightGrams?: number;
  defects: string[];
  skinIntactPercentage: number;
  sproutLengthMm?: number;
}

export interface GradingResult {
  grade: OnionGrade;
  reasons: string[];
  qualityScore: number; // 0 - 100
  agmarkCompliant: boolean;
}

export class GradingRuleEngine {
  public static evaluate(input: OnionAssessmentInput): GradingResult {
    const reasons: string[] = [];
    let score = 100;

    // Critical reject checks
    if (input.defects.includes('black_mold')) {
      return {
        grade: 'REJECT',
        reasons: ['Critical defect: Black mold (Aspergillus niger) detected'],
        qualityScore: 10,
        agmarkCompliant: false
      };
    }

    if (input.defects.includes('neck_rot')) {
      return {
        grade: 'REJECT',
        reasons: ['Critical defect: Bacterial neck rot detected'],
        qualityScore: 15,
        agmarkCompliant: false
      };
    }

    if ((input.sproutLengthMm || 0) > 8) {
      return {
        grade: 'REJECT',
        reasons: [`Severe sprouting (${input.sproutLengthMm}mm) exceeds threshold`],
        qualityScore: 25,
        agmarkCompliant: false
      };
    }

    // Size evaluations (AGMARK standard 45-70mm for Grade A)
    if (input.diameterMm >= 45 && input.diameterMm <= 70 && input.skinIntactPercentage >= 85 && input.defects.length === 0) {
      return {
        grade: 'GRADE_A',
        reasons: ['Optimal export diameter (45-70mm)', 'Skin layers intact (>85%)', 'Zero visual defects'],
        qualityScore: 95,
        agmarkCompliant: true
      };
    }

    if (input.diameterMm >= 35 && input.diameterMm <= 85 && (input.sproutLengthMm || 0) <= 3) {
      if (input.defects.includes('skin_crack')) score -= 15;
      if (input.skinIntactPercentage < 70) score -= 10;
      return {
        grade: 'GRADE_B',
        reasons: ['Standard commercial grade', 'Acceptable skin condition'],
        qualityScore: Math.max(score, 65),
        agmarkCompliant: true
      };
    }

    return {
      grade: 'GRADE_C',
      reasons: ['Processing grade: size out of standard or surface blemishes present'],
      qualityScore: 50,
      agmarkCompliant: true
    };
  }
}
