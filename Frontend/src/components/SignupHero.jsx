
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupHero() {
  return (
    <div className="hidden lg:flex w-[45%] bg-gradient-to-tr from-teal-900 via-teal-800 to-teal-700 text-white p-12 flex-col justify-between relative overflow-hidden select-none">
      
      {/* Branding Header Banner */}
     <div className="flex items-center gap-3.5 select-none">
  {/* Expanded logo container from w-8/h-8 up to an explicit w-11/h-11 layout */}
  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md shrink-0 overflow-hidden p-1.5">
    <img src='/images/shield.png' alt="MedVault Shield" className="w-full h-full object-contain" />
  </div>
  <div className="space-y-0.5">
    {/* Increased font size and weight to text-xl for high visibility and clarity */}
    <h1 className="text-xl font-black leading-none text-white tracking-wider">
      MedVault
    </h1>
    <span className="text-[10px] text-white font-abold tracking-wider uppercase block opacity-95">
      Rx Inventory System
    </span>
  </div>
</div>

      {/* Center Value Proposition Content */}
      <div className="space-y-6 max-w-md my-auto">
        <h2 className="text-4xl font-black tracking-tight leading-tight">
          Securing your pharmacy's supply chain, in real-time.
        </h2>
        <p className="text-xs font-semibold text-teal-100/70 leading-relaxed">
          Verify batches, track shelf expirations, and orchestrate lightning-fast orders with our secure clinical inventory protocol.
        </p>

        
      </div>

      {/* System Technical Footnotes */}
      <div className="flex justify-between items-center text-[10px] text-teal-200/50 font-bold tracking-wide border-t border-white/10 pt-4">
        <span>MedVault v1.4.2 Professional Edition</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Secured Cloud Server</span>
      </div>

    </div>
  );
}
