import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

function StatCard({ title, value, subtitle, trend }) {
  const isUp = trend && trend.value >= 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = isUp ? "text-emerald-600" : "text-rose-600";

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <Wallet className="w-4 h-4 text-slate-400" />
      </div>
      <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{subtitle}</span>
        {trend && (
          <span className={`inline-flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            {trend.prefix}
            {Math.abs(trend.value).toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SummaryCards({ totals }) {
  const { assets, liabilities, netWorth, change } = totals;

  const format = (n) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Net Worth"
        value={format(netWorth)}
        subtitle="Total Assets - Liabilities"
        trend={{ value: change, prefix: change >= 0 ? "+" : "-" }}
      />
      <StatCard title="Assets" value={format(assets)} subtitle="Current total" />
      <StatCard title="Liabilities" value={format(liabilities)} subtitle="Current total" />
      <StatCard
        title="Change (30d)"
        value={(change >= 0 ? "+" : "-") + format(Math.abs(change))}
        subtitle="Since last month"
        trend={{ value: change, prefix: change >= 0 ? "+" : "-" }}
      />
    </section>
  );
}
