const StatsCard = ({ icon, label, value, bgColor }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">
        {value !== undefined ? value.toLocaleString() : '—'}
      </p>
    </div>
  </div>
);

export default StatsCard;
