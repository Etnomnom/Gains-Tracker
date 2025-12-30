import { useState, useMemo } from 'react';

export interface Gain {
  id: number;
  amount: number;
  tag: string;
  date: Date;
}

export const CATEGORIES = [
  { name: 'Salary (PAYE)', taxable: true },
  { name: 'Freelance / Business', taxable: true },
  { name: 'Gifts', taxable: false },
  { name: 'Working Capital', taxable: false },
  { name: 'Crypto / Digital Assets', taxable: true },
  { name: 'Shares / Equities', taxable: false },
  { name: 'Real Estate', taxable: true },
];

export const useGains = () => {
  const [gains, setGains] = useState<Gain[]>([]);

  const calculations = useMemo(() => {
    // Filter for categories marked as taxable
    const taxableGainsTotal = gains
      .filter(g => CATEGORIES.find(c => c.name === g.tag)?.taxable)
      .reduce((sum, g) => sum + g.amount, 0);

    const totalGains = gains.reduce((sum, g) => sum + g.amount, 0);

    // Nigeria 2025 Progressive Tax Calculation
    let tax = 0;
    const TAX_FREE_THRESHOLD = 800000;

    if (taxableGainsTotal > TAX_FREE_THRESHOLD) {
      const taxableAmount = taxableGainsTotal - TAX_FREE_THRESHOLD;
      if (taxableAmount <= 2200000) {
        tax = taxableAmount * 0.15;
      } else {
        tax = (2200000 * 0.15) + ((taxableAmount - 2200000) * 0.25);
      }
    }

    return { totalGains, taxableGainsTotal, estimatedTax: tax };
  }, [gains]);

  return { ...calculations, gains, setGains };
};