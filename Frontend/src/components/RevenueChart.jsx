export default function RevenueChart({ data = [] }) {
  const values = data.map((item) =>
    Number(item.revenue || 0)
  );

  const maxValue = Math.max(...values, 1);

  const points = data
    .map((item, index) => {
      const x =
        data.length > 1
          ? 10 + index * (580 / (data.length - 1))
          : 300;

      const revenue = Number(item.revenue || 0);

      const y =
        130 -
        (revenue / maxValue) * 105;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            6-Month Revenue Analysis
          </h4>

          <p className="text-[10px] text-slate-400 mt-1">
            Revenue generated from completed sales
          </p>
        </div>

        <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded">
          Live Data
        </span>
      </div>

      {/* CHART */}
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-xs text-slate-400">
            No revenue data available.
          </p>
        </div>
      ) : (
        <div className="h-52 w-full">

          <svg
            viewBox="0 0 600 150"
            className="w-full h-40 overflow-visible"
          >
            {/* GRID */}
            <line
              x1="0"
              y1="130"
              x2="600"
              y2="130"
              stroke="#f1f5f9"
              strokeWidth="1"
            />

            <line
              x1="0"
              y1="80"
              x2="600"
              y2="80"
              stroke="#f1f5f9"
              strokeWidth="1"
            />

            <line
              x1="0"
              y1="30"
              x2="600"
              y2="30"
              stroke="#f1f5f9"
              strokeWidth="1"
            />

            {/* REVENUE LINE */}
            <polyline
              points={
                points ||
                "10,130 590,130"
              }
              fill="none"
              stroke="#0f766e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* POINTS */}
            {data.map((item, index) => {
              const x =
                data.length > 1
                  ? 10 +
                    index *
                      (580 /
                        (data.length - 1))
                  : 300;

              const revenue = Number(
                item.revenue || 0
              );

              const y =
                130 -
                (revenue / maxValue) *
                  105;

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="white"
                  stroke="#0f766e"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* MONTH LABELS */}
          <div className="flex justify-between text-[9px] text-slate-400 font-semibold uppercase px-1">
            {data.map((item, index) => (
              <span key={index}>
                {item.label?.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}