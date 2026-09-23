/**
 * Seed script for Indian APMC Mandi benchmarks
 */
export const mandiBenchmarkSeed = [
  {
    market: 'Lasalgaon (Nashik)',
    state: 'Maharashtra',
    modalPrice: 2550,
    minPrice: 1800,
    maxPrice: 2950,
    arrivalsTons: 3200
  },
  {
    market: 'Pimpalgaon Baswant',
    state: 'Maharashtra',
    modalPrice: 2500,
    minPrice: 1750,
    maxPrice: 2900,
    arrivalsTons: 2800
  },
  {
    market: 'Solapur',
    state: 'Maharashtra',
    modalPrice: 2300,
    minPrice: 1600,
    maxPrice: 2700,
    arrivalsTons: 1500
  },
  {
    market: 'Hubli',
    state: 'Karnataka',
    modalPrice: 2450,
    minPrice: 1700,
    maxPrice: 2800,
    arrivalsTons: 950
  }
];

console.log('Mandi seed dataset configured for deployment.');
