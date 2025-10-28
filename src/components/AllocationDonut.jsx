function arcOffsetForSegment(values, index, circumference) {
  const total = values.reduce((a, b) => a + b, 0);
  const lengths = values.map((v) => (v / total) * circumference);
  const offset = lengths.slice(0, index).reduce((a, b) => a + b, 0);
  // Stroke dash offset moves from 0 around the circle; use negative to start at top
  return offset;
}

export default function AllocationDonut({ data, title = "Asset Allocation" }) {
  const size = 220;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Distribution by category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div className="mx-auto">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={stroke}
              />
              {data.map((d, i) => {
                const values = data.map((x) => x.value);
                const length = (d.value / total) * c;
                const offset = arcOffsetForSegment(values, i, c);
                return (
                  <circle
                    key={d.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={d.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${length} ${c - length}`}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                  />
                );
              })}
            </g>
            <g>
              <foreignObject x={size / 2 - 70} y={size / 2 - 40} width="140" height="80">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    Total
                  </div>
                  <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {total.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          {data.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {d.label}
                </span>
              </div>
              <div className="text-sm tabular-nums text-slate-600 dark:text-slate-400">
                {((d.value / total) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
