interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  isTax?: boolean;
}

const StatCard = ({ title, value, subtitle, isTax }: StatCardProps) => {
  return (
    <div className={`p-6 rounded-2xl border ${isTax ? 'bg-green-600 border-green-500 text-white' : 'bg-white border-slate-200'}`}>
      <p className={`text-sm font-medium ${isTax ? 'text-green-100' : 'text-slate-500'}`}>{title}</p>
      <h2 className="text-4xl font-bold mt-2">
        ₦{value.toLocaleString()}
      </h2>
      <p className={`text-xs mt-2 ${isTax ? 'text-green-200' : 'text-slate-400'}`}>
        {subtitle}
      </p>
    </div>
  );
};

export default StatCard;