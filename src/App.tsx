import React, { useState } from 'react';
import { useGains } from './hooks/useGains';
import { TrendingUp, Plus, Download, Wallet, Trash2, Calendar } from 'lucide-react';
import RevenueMindMap from './components/RevenueMindMap';

// Props interface to fix TypeScript "any" errors
interface StatProps { title: string; value: number; subtitle: string; color: string; }

const StatCard = ({ title, value, subtitle, color }: StatProps) => (
  <div className="glass-card p-8 mb-6">
    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">{title}</p>
    <p className={`text-5xl font-black ${color}`}>₦{value.toLocaleString()}</p>
    <p className="text-xs text-white/20 mt-1">{subtitle}</p>
  </div>
);

function App() {
  const { totalGains, estimatedTax, gains, setGains } = useGains();

  return (
    <div className="min-h-screen pb-12">
      <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-400" />
          <span className="text-2xl font-bold text-white">GainTrack</span>
        </div>
        <div className="flex gap-4">
          <button className="glass-card px-6 py-2 flex items-center gap-2 text-sm text-white/80"><Download size={18} /> Export</button>
          <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center gap-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20"><Plus size={18} /> Add Entry</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">
        <StatCard title="Annual Inflow" value={totalGains} subtitle="Total tracked 2025" color="text-green-400" />
        <StatCard title="Est. Tax Liability" value={estimatedTax} subtitle="Progressive Calculation" color="text-rose-400" />

        <div className="glass-card p-6 h-80 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Visual Flow</p>
          <div className="w-full h-[85%]"><RevenueMindMap gains={gains} /></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/40 px-2">
            <Calendar size={18} /><span className="text-xs font-bold uppercase tracking-widest">History</span>
          </div>
          {gains.map(g => (
            <div key={g.id} className="glass-card p-5 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl text-white/40 group-hover:text-indigo-400"><Wallet size={20} /></div>
                <div>
                  <p className="text-xl font-bold text-white">₦{g.amount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{g.tag} • {new Date(g.date).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setGains(gains.filter(i => i.id !== g.id))} className="text-white/20 hover:text-rose-500 p-2"><Trash2 size={20} /></button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;