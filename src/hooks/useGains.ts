import { useState, useMemo, useEffect } from 'react';

export interface Gain {
  id: number;
  amount: number;
  tag: string;
  date: Date;
}

export const CATEGORIES = [
  { name: 'Salary', taxable: true },
  { name: 'Freelance', taxable: true },
  { name: 'Gift/Personal', taxable: false },
  { name: 'Dividends', taxable: true },
  { name: 'Other', taxable: true }
];

export function useGains() {
  // Initialize from localStorage to persist data across refreshes
  const [gains, setGains] = useState<Gain[]>(() => {
    const saved = localStorage.getItem('gaintrak_data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gaintrak_data', JSON.stringify(gains));
  }, [gains]);

  const totalGains = useMemo(() => 
    gains.reduce((sum, g) => sum + g.amount, 0), [gains]
  );

  const estimatedTax = useMemo(() => {
    const taxableIncome = gains
      .filter(g => CATEGORIES.find(c => c.name === g.tag)?.taxable)
      .reduce((sum, g) => sum + g.amount, 0);

    // Simple Nigeria-style progressive tax simulation
    if (taxableIncome <= 300000) return taxableIncome * 0.07;
    if (taxableIncome <= 600000) return 21000 + (taxableIncome - 300000) * 0.11;
    if (taxableIncome <= 1100000) return 54000 + (taxableIncome - 600000) * 0.15;
    return 129000 + (taxableIncome - 1100000) * 0.24;
  }, [gains]);

  return { gains, setGains, totalGains, estimatedTax };
}