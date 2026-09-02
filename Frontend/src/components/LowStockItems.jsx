import React from "react";

export default function LowStockItems({
  stockData = [],
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">

        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Low Stock Items
          </h4>

          <p className="text-[10px] text-slate-400 mt-1">
            Medicines requiring attention
          </p>
        </div>

        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded uppercase">
          Alerts
        </span>

      </div>

      {/* ITEMS */}
      <div className="space-y-3">

        {stockData.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xs font-semibold text-emerald-600">
              Stock levels look good.
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              No low-stock medicines found.
            </p>
          </div>
        ) : (
          stockData.map(
            (item, index) => {

              const percentage = parseInt(
                item.pct,
                10
              ) || 0;

              const isCritical =
                percentage <= 25;

              return (
                <div
                  key={index}
                  className="
                    border
                    border-slate-100
                    rounded-lg
                    p-3
                    hover:bg-slate-50
                    transition-colors
                  "
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3 min-w-0">

                      <span
                        className={`
                          w-2
                          h-2
                          rounded-full
                          shrink-0
                          ${
                            isCritical
                              ? "bg-rose-500"
                              : "bg-amber-400"
                          }
                        `}
                      />

                      <div className="min-w-0">

                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.name}
                        </p>

                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {item.info}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`
                        px-2
                        py-0.5
                        rounded
                        font-bold
                        text-[10px]
                        shrink-0
                        ${
                          isCritical
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                        }
                      `}
                    >
                      {item.pct}
                    </span>

                  </div>

                  {/* PROGRESS */}
                  <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className={`
                        h-full rounded-full
                        ${
                          isCritical
                            ? "bg-rose-500"
                            : "bg-amber-400"
                        }
                      `}
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              );
            }
          )
        )}

      </div>
    </div>
  );
}