describe('Frontend Grading Utilities', () => {
  it('should format percentage accurately', () => {
    const calcPercentage = (val: number, total: number) => Math.round((val / total) * 100);
    expect(calcPercentage(55, 100)).toBe(55);
    expect(calcPercentage(1, 3)).toBe(33);
  });

  it('should format Indian Rupee currency string', () => {
    const formatINR = (val: number) => '₹' + val.toLocaleString('en-IN');
    expect(formatINR(2550)).toBe('₹2,550');
    expect(formatINR(100000)).toBe('₹1,00,000');
  });
});
