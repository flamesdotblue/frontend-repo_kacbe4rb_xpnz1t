import { Calendar, PieChart, LineChart } from "lucide-react";

export default function Header({ period, setPeriod }) {
  const periods = [
    { key: "3M", label: "3M" },
    { key: "6M", label: "6M" },
    { key: "1Y", label: "1Y" },
    { key: "5Y", label: "5Y" },
  ];

  return (
    <header className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Personal Net Worth Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track your assets, liabilities, and growth over time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <PieChart className="w-5 h-5" />
            <LineChart className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm">
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  period === p.key
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                {p.label}
              </button>
            ))}
            <div className="hidden sm:flex items-center gap-1 px-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Period</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
