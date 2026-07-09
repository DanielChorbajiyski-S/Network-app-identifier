export const StackedTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

    return (
      <div className="bg-white text-gray-900 p-4 rounded-xl shadow-xl border border-gray-200 pointer-events-none min-w-40">
        <p className="font-bold text-lg text-gray-800 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
          {label}
        </p>
        
        <div className="space-y-1.5 mb-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center text-sm gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-600 font-medium">{entry.name}</span>
              </div>
              <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total</span>
          <span className="text-indigo-600 font-bold text-lg">{total.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};