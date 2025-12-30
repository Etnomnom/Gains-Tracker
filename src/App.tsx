import { useState } from 'react';
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
  
  // Modal & Input States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newTag, setNewTag] = useState(CATEGORIES[0].name);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Filtering State
  const [monthFilter, setMonthFilter] = useState('All');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount) return;
    
    setGains([...gains, { 
      id: Date.now(), 
      amount: Number(newAmount), 
      tag: newTag, 
      date: new Date(newDate) 
    }]);
    
    setNewAmount('');
    setIsModalOpen(false);
  };

  const filteredGains = monthFilter === 'All' 
    ? gains 
    : gains.filter(g => new Date(g.date).getMonth() === parseInt(monthFilter));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("GainTrack: 2025 Financial Ledger", 14, 20);
    
    const tableData = filteredGains.map(g => [
      new Date(g.date).toLocaleDateString('en-NG'),
      g.tag,
      `N${g.amount.toLocaleString()}`,
      CATEGORIES.find(c => c.name === g.tag)?.taxable ? 'Taxable' : 'Exempt'
    ]);

    autoTable(doc, {
      head: [['Date', 'Source', 'Amount', 'Tax Status']],
      body: tableData,
      startY: 30,
      headStyles: { fillColor: [22, 163, 74] }
    });

    doc.save(`GainTrack_Report_2025.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg text-white">
              <TrendingUp size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">GainTrack</span>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all font-medium">
              <Download size={18} /> Export PDF
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-md transition-all font-medium">
              <Plus size={18} /> Add Entry
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
        {/* Top Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Revenue (2025)" value={totalGains} subtitle="Combined portfolio inflows" />
          <StatCard title="Est. Tax Liability" value={estimatedTax} subtitle="Calculated via 2025 Tax Act" isTax />
        </section>

        {/* Mind Map */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-500">
            <PieChart size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Revenue Hub Visualization</h2>
          </div>
          <RevenueMindMap gains={gains} />
        </section>

        {/* History & Filter */}
        <section className="space-y-4 pb-20">
          <div className="flex justify-between items-center text-slate-500">
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Transaction History</h2>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1">
              <Calendar size={14} className="text-slate-400" />
              <select 
                value={monthFilter} 
                onChange={(e) => setMonthFilter(e.target.value)}
                className="text-sm font-bold outline-none bg-transparent cursor-pointer"
              >
                <option value="All">Full Year</option>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                  <option key={m} value={i}>{m} 2025</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredGains.length === 0 ? (
              <div className="p-16 text-center text-slate-400 font-medium">No records found for this period.</div>
            ) : (
              filteredGains.map(g => (
                <div key={g.id} className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">₦{g.amount.toLocaleString()}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        {g.tag} <span className="w-1 h-1 bg-slate-300 rounded-full"></span> {new Date(g.date).toLocaleDateString('en-NG')}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setGains(gains.filter(item => item.id !== g.id))}
                    className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <h3 className="text-2xl font-bold text-slate-900">New Inflow</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Amount (₦)</label>
                <input 
                  type="number" required value={newAmount} onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-green-500 outline-none text-2xl font-black transition-all"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Transaction Date</label>
                <input 
                  type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Source Category</label>
                <select 
                  value={newTag} onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
              </div>

              <button type="submit" className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
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