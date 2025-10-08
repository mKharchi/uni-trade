export function calculatePoints(price: number, category: string): number {
    const baseFactor = 10;
    const multipliers: Record<string, number> = {
      electronics: 2.0,
      clothing: 1.2,
      books: 1.0,
      furniture: 1.5,
      vehicles: 3.0,
    };
    const multiplier = multipliers[category.toLowerCase()] ?? 1.0;
  
    return Math.round(baseFactor * Math.log(price + 1) * multiplier);
  }
  