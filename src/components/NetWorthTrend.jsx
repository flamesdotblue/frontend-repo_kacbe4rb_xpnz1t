export default function NetWorthTrend({ points = [], title = "Net Worth Over Time" }) {
  // SVG chart dimensions
  const width = 520;
  const height = 220;
  const padding = 28;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const xStep = (width - padding * 2) / Math.max(points.length - 1, 1);

  const yScale = (v) => {
    if (max === min) return height / 2;
    const t = (v - min) / (max - min);
    return height - padding - t * (height - padding * 2);
  };

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${padding + i * xStep},${yScale(p.value)}`)
    .join(" ");

  const areaD = `M${padding},${height - padding} ` +
    points.map((p, i) => `L${padding + i * xStep},${yScale(p.value)}`).join(" ") +
    ` L${padding + (points.length - 1) * xStep},${height - padding} Z`;

  const formatCurrency = (n) =>
    n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly snapshot of your total net worth
        </p>
      </div>
      <div className="overflow-hidden rounded-xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}
             role="img" aria-label="Net worth line chart">
          {/* Grid */}
          <g>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <line
                key={t}
                x1={padding}
                x2={width - padding}
                y1={padding + t * (height - padding * 2)}
                y2={padding + t * (height - padding * 2)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Area fill */}
          <path d={areaD} fill="url(#grad)" opacity="0.6" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#0ea5e9" strokeWidth="3" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={p.label}>
              <circle
                cx={padding + i * xStep}
                cy={yScale(p.value)}
                r="3.5"
                fill="#0284c7"
                stroke="#fff"
                strokeWidth="1.5"
              />
              {/* Labels */}
              <text
                x={padding + i * xStep}
                y={height - 6}
                textAnchor="middle"
                className="fill-slate-500 text-[10px]"
              >
                {p.label}
              </text>
            </g>
          ))}

          {/* Min/Max labels */}
          <text x={padding} y={padding - 8} className="fill-slate-400 text-xs">
            {formatCurrency(max)}
          </text>
          <text x={padding} y={height - padding + 16} className="fill-slate-400 text-xs">
            {formatCurrency(min)}
          </text>

          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
