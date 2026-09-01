import React, { useState } from "react";

const categoryColors = [
  "#0f766e",
  "#2563eb",
  "#f59e0b",
  "#e11d48",
  "#7c3aed",
];

export default function AnalyticsCharts({
  revenueTrend = [],
  salesByCategory = [],
}) {
  const [activeCategory, setActiveCategory] = useState(null);

  // =========================================================
  // REVENUE / COGS CHART
  // =========================================================

  const maxValue = Math.max(
    ...revenueTrend.flatMap((item) => [
      Number(item?.revenue || 0),
      Number(item?.cogs || 0),
    ]),
    1
  );

  // =========================================================
  // CATEGORY PIE CHART
  // =========================================================

  const totalCategoryWeight =
    salesByCategory.reduce(
      (total, item) => total + Number(item?.percentage || 0),
      0
    ) || 1;

  let currentStart = 0;

  const gradientParts = salesByCategory.map((item, index) => {
    const percentage =
      (Number(item?.percentage || 0) / totalCategoryWeight) * 100;

    const start = currentStart;
    const end = start + percentage;

    currentStart = end;

    return `${categoryColors[index % categoryColors.length]} ${start}% ${end}%`;
  });

  const categoryGradient = gradientParts.join(", ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">

      {/* =====================================================
          REVENUE VS COGS
      ====================================================== */}

      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        <div className="flex justify-between items-center mb-6">

          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Revenue vs. Procurement Cost Trend
          </h4>

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">

            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              Sales Revenue
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              COGS
            </span>

          </div>

        </div>


        {/* No revenue data */}

        {revenueTrend.length === 0 ? (

          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            No revenue data available.
          </div>

        ) : (

          <div className="h-48 flex items-end justify-between px-4 border-b border-slate-100 pb-2 gap-2">

            {revenueTrend.map((item, idx) => {

              const labelValue = String(
                item?.label || `Month ${idx + 1}`
              );

              const displayLabel =
                labelValue.includes(" ")
                  ? labelValue.split(" ")[0]
                  : labelValue.slice(0, 3);

              const revenue = Number(item?.revenue || 0);
              const cogs = Number(item?.cogs || 0);

              const revAmount = revenue.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                }
              );

              const cogsAmount = cogs.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                }
              );

              return (

                <div
                  key={`${labelValue}-${idx}`}
                  className="flex flex-col items-center gap-2 group relative w-16 min-w-[40px]"
                >

                  {/* Tooltip */}

                  <div className="absolute bottom-40 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-10 bg-slate-900 text-white rounded-lg p-2.5 text-[10px] font-medium shadow-xl w-32 space-y-1">

                    <div className="text-[9px] text-slate-400 border-b border-slate-700 pb-1 font-bold uppercase tracking-wider">
                      {labelValue}
                    </div>

                    <div className="flex justify-between gap-2">
                      <span className="text-teal-400">
                        Revenue:
                      </span>

                      <span className="font-bold">
                        ${revAmount}
                      </span>
                    </div>

                    <div className="flex justify-between gap-2">
                      <span className="text-rose-400">
                        COGS:
                      </span>

                      <span className="font-bold">
                        ${cogsAmount}
                      </span>
                    </div>

                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900" />

                  </div>


                  {/* Bars */}

                  <div className="flex items-end gap-2 h-36 w-full justify-center">

                    <div
                      className="w-3.5 bg-teal-600 rounded-t transition-all duration-200 hover:bg-teal-500 cursor-pointer shadow-sm"
                      style={{
                        height: `${Math.max(
                          3,
                          (revenue / maxValue) * 100
                        )}%`,
                      }}
                    />

                    <div
                      className="w-3.5 bg-rose-500 rounded-t transition-all duration-200 hover:bg-rose-400 cursor-pointer shadow-sm"
                      style={{
                        height: `${Math.max(
                          3,
                          (cogs / maxValue) * 100
                        )}%`,
                      }}
                    />

                  </div>


                  {/* Month */}

                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-full">
                    {displayLabel}
                  </span>

                </div>

              );
            })}

          </div>

        )}

      </div>


      {/* =====================================================
          SALES BY CATEGORY
      ====================================================== */}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col relative">

        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Sales by Drug Category
        </h4>


        {salesByCategory.length === 0 ? (

          <div className="flex-1 flex items-center justify-center">

            <span className="text-xs text-slate-400 italic">
              No completed sales yet
            </span>

          </div>

        ) : (

          <div className="flex items-center gap-6 my-auto relative">

            {/* Pie */}

            <div
              className="w-28 h-28 rounded-full shrink-0 shadow-md transition-all duration-500 relative"
              style={{
                background: `conic-gradient(${categoryGradient})`,
              }}
            >

              {/* Center hole */}

              <div className="absolute inset-5 bg-white rounded-full flex items-center justify-center">

                <span className="text-[10px] font-bold text-slate-500">
                  Sales
                </span>

              </div>


              {/* Tooltip */}

              {activeCategory && (

                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1.5 rounded shadow-xl w-max z-20 pointer-events-none">

                  {activeCategory.name}:

                  <span className="text-teal-400 ml-1">
                    {activeCategory.percentage}%
                  </span>

                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-900" />

                </div>

              )}

            </div>


            {/* Category list */}

            <div className="flex-1 space-y-2 text-[11px] font-bold text-slate-400 max-h-36 overflow-y-auto">

              {salesByCategory.map((item, index) => (

                <div
                  key={item?.name || index}
                  className={`flex justify-between items-center gap-2 p-1 rounded transition-colors duration-150 ${
                    activeCategory?.name === item?.name
                      ? "bg-slate-50 text-slate-800"
                      : ""
                  }`}
                  onMouseEnter={() => setActiveCategory(item)}
                  onMouseLeave={() => setActiveCategory(null)}
                >

                  <span className="flex items-center gap-2 truncate">

                    <span
                      className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
                      style={{
                        backgroundColor:
                          categoryColors[
                            index % categoryColors.length
                          ],

                        transform:
                          activeCategory?.name === item?.name
                            ? "scale(1.3)"
                            : "scale(1)",
                      }}
                    />

                    <span
                      className="truncate text-slate-600"
                      title={item?.name}
                    >
                      {item?.name || "Unknown"}
                    </span>

                  </span>


                  <span className="text-slate-800 shrink-0">
                    {item?.percentage || 0}%
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}