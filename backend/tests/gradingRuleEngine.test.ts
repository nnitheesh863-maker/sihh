import { GradingRuleEngine } from '../src/services/gradingRuleEngine';

describe('GradingRuleEngine', () => {
  it('should classify healthy medium size onion as GRADE_A', () => {
    const result = GradingRuleEngine.evaluate({
      diameterMm: 55,
      defects: [],
      skinIntactPercentage: 90,
      sproutLengthMm: 0
    });

    expect(result.grade).toBe('GRADE_A');
    expect(result.agmarkCompliant).toBe(true);
    expect(result.qualityScore).toBeGreaterThanOrEqual(90);
  });

  it('should immediately reject onions with black mold', () => {
    const result = GradingRuleEngine.evaluate({
      diameterMm: 55,
      defects: ['black_mold'],
      skinIntactPercentage: 90
    });

    expect(result.grade).toBe('REJECT');
    expect(result.agmarkCompliant).toBe(false);
  });

  it('should classify onions with skin cracks as GRADE_B', () => {
    const result = GradingRuleEngine.evaluate({
      diameterMm: 48,
      defects: ['skin_crack'],
      skinIntactPercentage: 75
    });

    expect(result.grade).toBe('GRADE_B');
    expect(result.agmarkCompliant).toBe(true);
  });
});
