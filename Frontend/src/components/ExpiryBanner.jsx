import React from "react";
import { AlertCircle } from "lucide-react";

export default function ExpiryBanner({ summary }) {
  return (
    <div className="bg-teal-800 text-white rounded-xl p-5 shadow-sm flex items-center justify-between border border-teal-900 relative overflow-hidden">
      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
          <AlertCircle className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-1.5">
            Total Expired Stock Loss:{" "}
            <span className="text-teal-200 font-black">
              {summary?.totalExpiryLoss}
            </span>
          </h2>
          <p className="text-[11px] text-teal-100 font-medium mt-0.5">
            Live calculation: expired units multiplied by their cost price.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 text-right z-10 pr-4">
        <div>
          <span className="text-2xl font-black block tracking-tight">
            {summary?.batchesToDispose} Batches
          </span>
          <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">
            To Dispose
          </span>
        </div>
        <div className="border-l border-teal-700/60 h-8" />
        <div>
          <span className="text-2xl font-black block tracking-tight">
            {summary?.batchesEligibleForReturn} Batches
          </span>
          <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">
            Eligible for Return
          </span>
        </div>
      </div>
    </div>
  );
}
