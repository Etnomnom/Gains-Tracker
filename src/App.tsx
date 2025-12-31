import React, { useState, useEffect } from 'react';
import { useGains, CATEGORIES } from './hooks/useGains';
import { 
  TrendingUp, Plus, Download, Wallet, Trash2, X, 
  PieChart, Calendar 
} from 'lucide-react';
import RevenueMindMap from './components/RevenueMindMap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Fix for TypeScript "any" errors
interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  colorClass: string;
}

const StatCard = ({ title, value, subtitle, colorClass }: StatCardProps) => (
  <div className="glass-card p-8">
    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">{title}</p>
    <p className={`text-5xl font-black ${colorClass}`}>₦{value.toLocaleString()}</p>
    <p className="text-xs text-white/20 mt-1">{subtitle}</p>
  </div>
);

function App() {
  const { totalGains, estimatedTax, gains, setGains } = useGains();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newTag, setNewTag] = useState(CATEGORIES[0].name);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount) return;
    setGains([...gains, { id: Date.now(), amount: Number(newAmount), tag: newTag, date: new Date(newDate) }]);
    setNewAmount('');
    setIsModalOpen(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("GainTrack 2025 Ledger", 14, 20);
    const tableData = gains.map(g => [new Date(g.date).toLocaleDateString(), g.tag, `N${g.amount}`]);
    autoTable(doc, { head: [['Date', 'Source', 'Amount']], body: tableData, startY: 30 });
    doc.save(`GainTrack_Report.pdf`);
  };

  return (
    <div className="min-h-screen pb-12">
      <nav className="p-6 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-400" />
          <span className="text-2xl font-bold tracking-tight text-white">GainTrack</span>
        </div>
        <div className="flex gap-4">
          <button onClick={downloadPDF} className="glass-card px-6 py-2 flex items-center gap-2 text-sm font-medium text-white/80 hover:bg-white/10">
            <Download size={18} /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center gap-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
            <Plus size={18} /> Add Entry
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="space-y-4">
          <StatCard title="Annual Inflow" value={totalGains} subtitle="Total tracked 2025" colorClass="text-green-400" />
          <StatCard title="Est. Tax Liability" value={estimatedTax} subtitle="Progressive Calculation" colorClass="text-rose-400" />
        </div>

        <div className="glass-card p-6 h-80">
          <div className="flex items-center gap-2 mb-4 text-white/40">
            <PieChart size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Visual Flow</span>
          </div>
          <div className="w-full h-[85%]">
            <RevenueMindMap gains={gains} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/40 px-2">
            <Calendar size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">History</span>
          </div>
          <div className="space-y-3">
            {gains.map(g => (
              <div key={g.id} className="glass-card p-5 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl text-white/40 group-hover:text-indigo-400 transition-colors"><Wallet size={20} /></div>
                  <div>
                    <p className="text-xl font-bold text-white">₦{g.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{g.tag} • {new Date(g.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={() => setGains(gains.filter(i => i.id !== g.id))} className="text-white/20 hover:text-rose-500 transition-all p-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="glass-card w-full max-w-md p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">New Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/40 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input type="number" required value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl outline-none text-xl font-black text-white focus:border-indigo-500 transition-all" placeholder="Amount (₦)" />
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl outline-none font-bold text-white/60 focus:border-indigo-500" />
              <select value={newTag} onChange={(e) => setNewTag(e.target.value)} className="w-full bg-black/20 border border-white/10 px-6 py-4 rounded-2xl outline-none font-bold text-white/60 focus:border-indigo-500">
                {CATEGORIES.map(cat => <option key={cat.name} value={cat.name} className="bg-slate-900">{cat.name}</option>)}
              </select>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">Confirm Entry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;