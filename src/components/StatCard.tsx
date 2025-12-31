interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  isTax?: boolean;
}

const StatCard = ({ title, value, subtitle, isTax = false }: StatCardProps) => {
  return (
    <div className="bg-card backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-[1.02] shadow-lg">
      <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
        {title}
      </p>
      <p className={`text-4xl font-black mb-1 ${isTax ? 'text-red-400' : 'text-green-400'}`}>
        ₦{value.toLocaleString()}
      </p>
      <p className="text-xs text-white/50">{subtitle}</p>
    </div>
  );
};

export default StatCard;