import { useState, useMemo } from 'react';

export const CATEGORIES = [
  { name: 'Salary', color: '#818cf8' },
  { name: 'Freelance', color: '#34d399' },
  { name: 'Dividends', color: '#fbbf24' },
  { name: 'Other', color: '#94a3b8' }
];

export function useGains() {
  const [gains, setGains] = useState<any[]>([]);

  const totalGains = useMemo(() => 
    gains.reduce((sum, item) => sum + item.amount, 0), 
  [gains]);

  const estimatedTax = useMemo(() => {
    let tax = 0;
    const income = totalGains;

    // Progressive Brackets (Example: Nigerian Personal Income Tax style)
    if (income <= 300000) {
      tax = income * 0.07;
    } else if (income <= 600000) {
      tax = (300000 * 0.07) + ((income - 300000) * 0.11);
    } else if (income <= 1100000) {
      tax = (300000 * 0.07) + (300000 * 0.11) + ((income - 600000) * 0.15);
    } else {
      tax = (300000 * 0.07) + (300000 * 0.11) + (500000 * 0.15) + ((income - 1100000) * 0.24);
    }
    return Math.floor(tax);
  }, [totalGains]);

  return { totalGains, estimatedTax, gains, setGains };
}