import { Search, Bell } from 'lucide-react';

export default function Navbar({ title, searchQuery="", setSearchQuery, currentUser }) {

  const fullName = currentUser?.full_name || currentUser?.username || "Loading Account...";
  
  const displayRole = currentUser?.role === 'Admin' ? 'Clinic Administrator' : (currentUser?.role || 'Medical Staff');
  const nameInitials = fullName
    .split(' ')
    .map(namePart => namePart[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 transition-all">
      
      {/* 🏷️ FIXED DYNAMIC HEADER: Matching the screen precisely */}
      <h2 className="text-xl font-bold tracking-tight text-slate-800">
        {title}
      </h2>
      
      <div className="flex items-center gap-5">
        {/* Universal Top Search Bar */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Search patient, PO, drug..." 
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Notifications Bell */}
        <div className="relative cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-[18px] h-[18px] text-slate-500 stroke-[2]" />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full">
            4
          </span>
        </div>

        {/* 👤 FIXED USER PROFILE AREA: Styled exact like the interface screen */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-5 h-8">
          {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs border border-teal-200 shadow-xs uppercase">
            {nameInitials}
          </div> */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-700 leading-tight tracking-wide">
              {fullName}
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-normal mt-0.5">
              {displayRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}