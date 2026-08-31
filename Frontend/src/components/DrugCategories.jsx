import React from "react";

export default function DrugCategories({
  categoriesData = [],
}) {
  const totalPercentage =
    categoriesData.reduce(
      (total, category) =>
        total +
        Number(
          String(category.percentage)
            .replace("%", "") || 0
        ),
      0
    );

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">

      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Drug Categories
          </h4>

          <p className="text-[10px] text-slate-400 mt-1">
            Inventory distribution
          </p>
        </div>
      </div>

      {categoriesData.length === 0 ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-xs text-slate-400">
            No category data available.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-6">

          {/* DONUT */}
          <div
            className="
              relative
              w-28
              h-28
              rounded-full
              border-[12px]
              border-teal-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <div className="text-center">
              <span className="text-xl font-extrabold text-slate-800 block">
                {totalPercentage}%
              </span>

              <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">
                Shown
              </span>
            </div>
          </div>

          {/* CATEGORY LIST */}
          <div className="flex-1 space-y-2.5">

            {categoriesData.map(
              (category, index) => (
                <div
                  key={
                    category.name || index
                  }
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-500 min-w-0">
                    <span
                      className={`
                        w-2 h-2
                        rounded-full
                        shrink-0
                        ${category.color || "bg-teal-600"}
                      `}
                    />

                    <span className="truncate">
                      {category.name}
                    </span>
                  </div>

                  <span className="font-bold text-slate-900 ml-2">
                    {category.percentage}
                  </span>
                </div>
              )
            )}

          </div>
        </div>
      )}
    </div>
  );
}