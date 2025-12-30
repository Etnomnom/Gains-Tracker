import { useState, useEffect } from 'react'; // Added useEffect
import { useGains, CATEGORIES } from './hooks/useGains';
import { 
  TrendingUp, Plus, Download, Wallet, Trash2, X, 
  PieChart, Activity, Calendar 
} from 'lucide-react';
import StatCard from './components/StatCard';
import RevenueMindMap from './components/RevenueMindMap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const { totalGains, estimatedTax, gains, setGains } = useGains();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newTag, setNewTag] = useState(CATEGORIES[0].name);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthFilter, setMonthFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors on deployment
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount) return;
    setGains([...gains, { id: Date.now(), amount: Number(newAmount), tag: newTag, date: new Date(newDate) }]);
    setNewAmount('');
    setIsModalOpen(false);
  };

  const filteredGains = monthFilter === 'All' 
    ? gains 
    : gains.filter(g => new Date(g.date).getMonth() === parseInt(monthFilter));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("GainTrack: 2025 Financial Ledger", 14, 20);
    const tableData = filteredGains.map(g => [
      new Date(g.date).toLocaleDateString('en-NG'),
      g.tag,
      `N${g.amount.toLocaleString()}`,
      CATEGORIES.find(c => c.name === g.tag)?.taxable ? 'Taxable' : 'Exempt'
    ]);
    autoTable(doc, { head: [['Date', 'Source', 'Amount', 'Tax Status']], body: tableData, startY: 30 });
    doc.save(`GainTrack_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <TrendingUp className="text-green-600" />
          <span className="text-xl font-bold">GainTrack</span>
          <div className="ml-auto flex gap-3">
            <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <Download size={18} /> Export
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all">
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Annual Inflow" value={totalGains} subtitle="Total tracked 2025" />
          <StatCard title="Est. Tax Liability" value={estimatedTax} subtitle="Progressive Calculation" isTax />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <PieChart size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Visual Flow</h2>
          </div>
          <RevenueMindMap gains={gains} />
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center text-slate-500">
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <h2 className="text-sm font-bold uppercase tracking-wider">History</h2>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1">
              <Calendar size={14} className="text-slate-400" /> 
              <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="text-sm font-bold outline-none bg-transparent cursor-pointer">
                <option value="All">All 2025</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                  <option key={m} value={i}>{m} 2025</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {filteredGains.length === 0 ? (
              <div className="p-10 text-center text-slate-400">No entries yet. Click "Add Entry" to start.</div>
            ) : (
              filteredGains.map(g => (
                <div key={g.id} className="p-5 flex justify-between items-center hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-500"><Wallet size={20} /></div>
                    <div>
                      <p className="text-lg font-bold">₦{g.amount.toLocaleString()}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {g.tag} • {new Date(g.date).toLocaleDateString('en-NG')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setGains(gains.filter(i => i.id !== g.id))} className="text-slate-300 hover:text-red-500 transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">New Entry</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Amount (₦)</label>
                <input type="number" required value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 outline-none text-xl font-black" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Source</label>
                <select value={newTag} onChange={(e) => setNewTag(e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold">
                  {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xl hover:bg-green-700">Confirm Entry</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;