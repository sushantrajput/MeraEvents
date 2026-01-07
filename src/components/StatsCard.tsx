import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
}

export function StatsCard({ label, value, icon: Icon, colorClass }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-5">
      <div className={`p-4 rounded-lg text-white ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}