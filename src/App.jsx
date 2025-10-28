import { useMemo, useState } from "react";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import AllocationDonut from "./components/AllocationDonut";
import NetWorthTrend from "./components/NetWorthTrend";

export default function App() {
  const [period, setPeriod] = useState("1Y");

  // Sample data for demonstration; replace with your own sources anytime
  const accounts = [
    { name: "Checking", type: "Cash", value: 5200 },
    { name: "Savings", type: "Cash", value: 18250 },
    { name: "Brokerage", type: "Investments", value: 83500 },
    { name: "401k", type: "Retirement", value: 124300 },
    { name: "Home", type: "Real Estate", value: 320000 },
    { name: "Mortgage", type: "Debt", value: -214500 },
    { name: "Auto Loan", type: "Debt", value: -9500 },
    { name: "Credit Card", type: "Debt", value: -1200 },
  ];

  const { assets, liabilities, netWorth } = useMemo(() => {
    const assets = accounts.filter((a) => a.value > 0).reduce((s, a) => s + a.value, 0);
    const liabilities = Math.abs(
      accounts.filter((a) => a.value < 0).reduce((s, a) => s + a.value, 0)
    );
    return { assets, liabilities, netWorth: assets - liabilities };
  }, [accounts]);

  const change = Math.round(netWorth * 0.012); // mock 1.2% monthly change

  const allocation = useMemo(() => {
    const groups = {
      Cash: 0,
      Investments: 0,
      Retirement: 0,
      "Real Estate": 0,
      Debt: 0,
    };
    for (const a of accounts) {
      if (a.value < 0) groups["Debt"] += Math.abs(a.value);
      else groups[a.type] += a.value;
    }
    const palette = {
      Cash: "#22c55e",
      Investments: "#3b82f6",
      Retirement: "#a855f7",
      "Real Estate": "#f59e0b",
      Debt: "#ef4444",
    };
    return Object.entries(groups)
      .filter(([, v]) => v > 0)
      .map(([label, value]) => ({ label, value, color: palette[label] }));
  }, [accounts]);

  const trendPoints = useMemo(() => {
    // Generate a simple synthetic time series based on netWorth
    const months = period === "3M" ? 3 : period === "6M" ? 6 : period === "1Y" ? 12 : 60;
    const labels = new Intl.DateTimeFormat(undefined, { month: "short" });
    const now = new Date();
    const base = netWorth * 0.8; // start lower for visual variance
    const pts = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const seasonal = Math.sin((i / 12) * Math.PI * 2) * 0.03; // +/-3%
      const drift = (i / months) * 0.1; // up to +10%
      const value = Math.max(0, base * (1 + seasonal + drift));
      pts.push({ label: labels.format(d), value: Math.round(value) });
    }
    return pts;
  }, [period, netWorth]);

  const totals = { assets, liabilities, netWorth, change };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header period={period} setPeriod={setPeriod} />

        <div className="mt-6">
          <SummaryCards totals={totals} />
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2">
            <AllocationDonut data={allocation} />
          </div>
          <div className="xl:col-span-3">
            <NetWorthTrend points={trendPoints} />
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-500">
          Demo data shown. Replace with your own figures anytime.
        </footer>
      </div>
    </div>
  );
}
