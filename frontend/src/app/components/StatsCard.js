import { FiActivity } from "react-icons/fi";

export default function StatsCard({
  title,
  value,
  icon,
  color = "bg-gradient-to-r from-blue-500 to-blue-600",
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`${color} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon && <div className="text-white opacity-80">{icon}</div>}
        </div>
      </div>
      <div className="px-6 py-2">
        <div className="flex items-center">
          <FiActivity className="w-2 h-2 text-green-400 mr-2" />
          <span className="text-xs text-gray-500">Live data</span>
        </div>
      </div>
    </div>
  );
}
