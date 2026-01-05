import React, { useState, useEffect } from 'react';
import { useGains, CATEGORIES } from './hooks/useGains';
import { 
  TrendingUp, Plus, Download, Wallet, Trash2, X, 
  PieChart, Calendar 
} from 'lucide-react';
import RevenueMindMap from './components/RevenueMindMap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  colorClass: string;
}

const StatCard = ({ title, value, subtitle, colorClass }: StatCardProps) => (
  <div className="glass-card p-8 hover:border-purple-500/30 transition-all duration-300">
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
      {/* CENTERED HEADER */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10 px-6 py-6">
        <div className="flex flex-col items-center gap-4 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-400" size={32} />
            <span className="text-3xl font-black text-white tracking-tight">GainTrack</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadPDF} 
              className="flex items-center gap-2 px-5 py-2.5 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all backdrop-blur-sm hover:scale-105"
            >
              <Download size={18} /> Export
            </button>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all shadow-lg shadow-purple-500/20 hover:scale-105"
            >
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 space-y-6 mt-8">
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
              <div key={g.id} className="glass-card p-5 flex justify-between items-center group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-300 border border-purple-400/20 group-hover:bg-purple-500/30 transition-colors">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">₦{g.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{g.tag} • {new Date(g.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setGains(gains.filter(i => i.id !== g.id))} 
                  className="text-white/20 hover:text-rose-500 transition-all p-2 hover:scale-110"
                >
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
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-2xl font-bold text-white">New Entry</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 bg-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-all hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input 
                type="number" 
                required 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none text-xl font-black placeholder-white/30 focus:border-purple-500 focus:bg-white/10 transition-all" 
                placeholder="Amount (₦)" 
              />
              <input 
                type="date" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none font-bold focus:border-purple-500 focus:bg-white/10 transition-all" 
              />
              <select 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl outline-none font-bold focus:border-purple-500 focus:bg-white/10 transition-all"
              >
                {CATEGORIES.map(cat => <option key={cat.name} value={cat.name} className="bg-[#302C3E]">{cat.name}</option>)}
              </select>
              <button 
                type="submit" 
                className="w-full py-5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-black text-xl hover:from-green-500 hover:to-green-400 transition-all shadow-lg shadow-green-500/20 hover:scale-105"
              >
                Confirm Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;