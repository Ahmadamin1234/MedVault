import { Plus, Trash2 } from 'lucide-react';
import React,{ useState } from 'react';
export default function StaffDashboard({ staffList, logsData, onOpenInvite , onUpdateStaff, onDeleteStaff}) {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const handleToggleAccess= async (member) => {
    if (!onUpdateStaff) return;
    setUpdatingId(member.id);
    try{
      await onUpdateStaff(member.id , {access: !member.access});
    }catch(err){
      console.log("Failed to change user access:", err);

    }finally{
      setUpdatingId(null)
    }
  };
  const handleDeleteClick = async (member) => {
    if (!onDeleteStaff) return
    if (!window.confirm(`Are you absolutely sure you want to delete ${member.name}? This will permanently revoke their application login privilegs.`)){
      return;
    }
    setDeletingId(member.id);
  try {
    await onDeleteStaff(member.id);
  }catch (err){
    console.log("Failed to delte staff member :", err)
  }finally{
    setDeletingId(null);
  }
  };
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Main Directory Split Panels Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT TWO-COLUMNS: Active Staff Directory Card Layout */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2">
            <h4 className="text-sm font-bold text-slate-800">Active Staff Directory</h4>
            <button 
              onClick={onOpenInvite}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Invite New Staff
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Email Address</th>
                  <th className="py-3 px-2">Phone</th>
                  <th className="py-3 px-2">Last Active</th>
                  <th className="py-3 px-2 text-center">Access</th>
                  <th className='py-3 px-2 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 font-semibold">
                {staffList?.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-slate-900">{member.name}</td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                        member.role === 'Chief Pharmacist' ? 'bg-teal-50 text-teal-600 border border-teal-100' :
                        member.role === 'Pharmacist' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                        member.role === 'Technician' ? 'bg-purple-50 text-purple-500 border border-purple-100' :
                        member.role === 'Cashier' ? 'bg-amber-50 text-amber-500 border border-amber-100' :
                        'bg-rose-50 text-rose-500 border border-rose-100'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-medium text-slate-400">{member.email}</td>
                    <td className="py-3.5 px-2 font-mono text-slate-400 text-[11px] font-medium">{member.phone}</td>
                    <td className="py-3.5 px-2 font-medium text-slate-400">{member.lastActive}</td>
                    <td className="py-3.5 px-2 text-center">
                      {/* Exact Custom Styled Sliding Access Toggle */}
                      <label className={`relative inline-flex items-center ${updatingId === member.id ? 'cursor-not-allowed':'cursor-pointer'}`}>
                        <input type="checkbox" checked={member.access} 
                        onChange = {() => handleToggleAccess(member)}
                        disabled ={updatingId === member.id}
                        className="sr-only peer" />
                        <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />
                      </label>
                    </td>
                    <td className='py-3.5 px-2 text-center'>
                      <button onClick={()=> handleDeleteClick(member)}
                      disabled={updatingId === member.id || deletingId === member.id}
                      title={`Delete ${member.name}`}
                      className='p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer active":sacle-9- disabled:opacity-50'>
                        <Trash2 className='w-4 h-4'/>
                      </button>
                    </td>
                  </tr>
                ))}
                {(!staffList || staffList.length === 0) && (
                  <tr>
                  <td colSpan='7' className='text-center py-8 text-slate-400 italic'>
                    No staff members register in your database directory.
                  </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

       
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-800 pb-2">System Activity Log</h4>
          <div className="space-y-5">
            {logsData?.map((log) => (
              <div key={log.id} className="text-xs space-y-1 font-semibold">
                <p className="text-slate-700 leading-snug tracking-wide">{log.text}</p>
                <span className="text-[10px] text-slate-400 font-medium block">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
