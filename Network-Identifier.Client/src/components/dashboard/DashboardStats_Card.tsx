interface DashboardStats_CardProps {
  title: string;
  value: string | number;
  colorClass?: string;
  isLoading?: boolean;
}

export function DashboardStats_Card({ title, value, colorClass = 'text-indigo-600', isLoading }: DashboardStats_CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
        {isLoading ? '...' : value}
      </p>
    </div>
  );
}
