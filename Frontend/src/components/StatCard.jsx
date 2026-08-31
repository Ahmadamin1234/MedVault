import React from "react";
import {
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";

const iconMap = {
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
};

const sparklines = [
  {
    path: "M 0 25 C 20 20, 30 10, 50 15 S 80 5, 100 2",
    color: "stroke-emerald-500",
  },
  {
    path: "M 0 5 C 20 12, 40 18, 60 10 S 80 25, 100 28",
    color: "stroke-amber-500",
  },
  {
    path: "M 0 25 C 15 15, 30 28, 50 20 S 75 10, 100 15",
    color: "stroke-rose-500",
  },
  {
    path: "M 0 28 C 20 20, 40 5, 60 18 S 80 2, 100 0",
    color: "stroke-emerald-500",
  },
];

export default function StatCard({ statsData = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {statsData.map((stat, index) => {
        const IconComponent =
          iconMap[stat.icon] || Package;

        const spark =
          sparklines[index] || sparklines[0];

        return (
          <div
            key={stat.title || index}
            className="
              bg-white
              p-5
              rounded-xl
              border border-slate-200
              shadow-sm
              relative
              overflow-hidden
              min-h-[135px]
              transition-all
              hover:shadow-md
              hover:-translate-y-0.5
            "
          >
            {/* TOP */}
            <div className="flex justify-between items-start relative z-10">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>

                <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {stat.value}
                </h3>
              </div>

              <div
                className={`
                  p-2.5
                  rounded-lg
                  shrink-0
                  ${stat.bg || "bg-slate-50"}
                  ${stat.color || "text-slate-600"}
                `}
              >
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            {/* SUBTEXT */}
            <p className="text-[10px] text-slate-400 mt-3 font-medium relative z-10">
              {stat.subtext}
            </p>

            {/* SPARKLINE */}
            <div className="absolute bottom-3 right-4 w-24 h-9 opacity-80 pointer-events-none">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <path
                  d={spark.path}
                  fill="none"
                  className={spark.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}