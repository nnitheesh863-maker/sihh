export interface MandiPriceRecord {
  marketName: string;
  district: string;
  state: string;
  minPricePerQuintal: number;
  maxPricePerQuintal: number;
  modalPricePerQuintal: number;
  gradeAModalPrice: number;
  gradeBModalPrice: number;
  gradeCModalPrice: number;
  date: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export class MandiPriceService {
  private static markets: MandiPriceRecord[] = [
    {
      marketName: 'Lasalgaon APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      minPricePerQuintal: 1800,
      maxPricePerQuintal: 2950,
      modalPricePerQuintal: 2550,
      gradeAModalPrice: 2950,
      gradeBModalPrice: 2400,
      gradeCModalPrice: 1850,
      date: new Date().toISOString().split('T')[0],
      trend: 'UP'
    },
    {
      marketName: 'Pimpalgaon APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      minPricePerQuintal: 1750,
      maxPricePerQuintal: 2900,
      modalPricePerQuintal: 2500,
      gradeAModalPrice: 2900,
      gradeBModalPrice: 2350,
      gradeCModalPrice: 1800,
      date: new Date().toISOString().split('T')[0],
      trend: 'UP'
    },
    {
      marketName: 'Solapur APMC',
      district: 'Solapur',
      state: 'Maharashtra',
      minPricePerQuintal: 1600,
      maxPricePerQuintal: 2700,
      modalPricePerQuintal: 2300,
      gradeAModalPrice: 2700,
      gradeBModalPrice: 2200,
      gradeCModalPrice: 1650,
      date: new Date().toISOString().split('T')[0],
      trend: 'STABLE'
    },
    {
      marketName: 'Azadpur Mandi',
      district: 'New Delhi',
      state: 'Delhi',
      minPricePerQuintal: 2200,
      maxPricePerQuintal: 3400,
      modalPricePerQuintal: 3100,
      gradeAModalPrice: 3400,
      gradeBModalPrice: 2900,
      gradeCModalPrice: 2250,
      date: new Date().toISOString().split('T')[0],
      trend: 'UP'
    }
  ];

  public static getLivePrices(): MandiPriceRecord[] {
    return this.markets;
  }

  public static estimateBatchValuation(gradeAKg: number, gradeBKg: number, gradeCKg: number): {
    totalEstimatedValueInr: number;
    benchmarkMarket: string;
    details: Record<string, number>;
  } {
    const lasalgaon = this.markets[0];
    const valA = (gradeAKg / 100) * lasalgaon.gradeAModalPrice;
    const valB = (gradeBKg / 100) * lasalgaon.gradeBModalPrice;
    const valC = (gradeCKg / 100) * lasalgaon.gradeCModalPrice;
    return {
      totalEstimatedValueInr: Math.round(valA + valB + valC),
      benchmarkMarket: lasalgaon.marketName,
      details: {
        gradeAValue: Math.round(valA),
        gradeBValue: Math.round(valB),
        gradeCValue: Math.round(valC)
      }
    };
  }
}
