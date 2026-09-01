import { Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

export default function StaffDashboard({
  staffList,
  logsData,
  onOpenInvite,
  onUpdateStaff,
  onDeleteStaff
}) {

  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Staff member waiting for delete confirmation
  const [staffToDelete, setStaffToDelete] = useState(null);


  const handleToggleAccess = async (member) => {

    if (!onUpdateStaff) return;

    setUpdatingId(member.id);

    try {

      await onUpdateStaff(
        member.id,
        {
          access: !member.access
        }
      );

    } catch (err) {

      console.log(
        "Failed to change user access:",
        err
      );

    } finally {

      setUpdatingId(null);

    }
  };


  // Open confirmation modal
  const handleDeleteClick = (member) => {

    setStaffToDelete(member);

  };


  // Actually delete staff
  const handleConfirmDelete = async () => {

    if (!onDeleteStaff || !staffToDelete) return;

    const member = staffToDelete;

    setDeletingId(member.id);

    try {

      await onDeleteStaff(member.id);

      // Close modal after successful deletion
      setStaffToDelete(null);

    } catch (err) {

      console.log(
        "Failed to delete staff member:",
        err
      );

    } finally {

      setDeletingId(null);

    }
  };


  // Cancel delete
  const handleCancelDelete = () => {

    if (deletingId) return;

    setStaffToDelete(null);

  };


  return (

    <div className="space-y-6 animate-fadeIn">

      {/* Main Directory Split Panels Container */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* LEFT TWO-COLUMNS */}

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">

          <div className="flex justify-between items-center pb-2">

            <h4 className="text-sm font-bold text-slate-800">
              Active Staff Directory
            </h4>

            <button
              onClick={onOpenInvite}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />

              Invite New Staff

            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse text-xs">

              <thead>

                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider">

                  <th className="py-3 px-2">
                    Name
                  </th>

                  <th className="py-3 px-2">
                    Role
                  </th>

                  <th className="py-3 px-2">
                    Email Address
                  </th>

                  <th className="py-3 px-2">
                    Phone
                  </th>

                  <th className="py-3 px-2">
                    Last Active
                  </th>

                  <th className="py-3 px-2 text-center">
                    Access
                  </th>

                  <th className="py-3 px-2 text-center">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-50 text-slate-600 font-semibold">

                {staffList?.map((member) => (

                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >

                    <td className="py-3.5 px-2 font-bold text-slate-900">
                      {member.name}
                    </td>


                    <td className="py-3.5 px-2">

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                          member.role === 'Chief Pharmacist'
                            ? 'bg-teal-50 text-teal-600 border border-teal-100'
                            : member.role === 'Pharmacist'
                            ? 'bg-blue-50 text-blue-500 border border-blue-100'
                            : member.role === 'Technician'
                            ? 'bg-purple-50 text-purple-500 border border-purple-100'
                            : member.role === 'Cashier'
                            ? 'bg-amber-50 text-amber-500 border border-amber-100'
                            : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}
                      >

                        {member.role}

                      </span>

                    </td>


                    <td className="py-3.5 px-2 font-medium text-slate-400">
                      {member.email}
                    </td>


                    <td className="py-3.5 px-2 font-mono text-slate-400 text-[11px] font-medium">
                      {member.phone}
                    </td>


                    <td className="py-3.5 px-2 font-medium text-slate-400">
                      {member.lastActive}
                    </td>


                    <td className="py-3.5 px-2 text-center">

                      <label
                        className={`relative inline-flex items-center ${
                          updatingId === member.id
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >

                        <input
                          type="checkbox"
                          checked={member.access}
                          onChange={() =>
                            handleToggleAccess(member)
                          }
                          disabled={
                            updatingId === member.id
                          }
                          className="sr-only peer"
                        />

                        <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600" />

                      </label>

                    </td>


                    <td className="py-3.5 px-2 text-center">

                      <button
                        onClick={() =>
                          handleDeleteClick(member)
                        }
                        disabled={
                          updatingId === member.id ||
                          deletingId === member.id
                        }
                        title={`Delete ${member.name}`}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
                      >

                        <Trash2 className="w-4 h-4" />

                      </button>

                    </td>

                  </tr>

                ))}


                {(!staffList ||
                  staffList.length === 0) && (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-8 text-slate-400 italic"
                    >
                      No staff members registered in your database directory.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* SYSTEM LOG */}

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">

          <h4 className="text-sm font-bold text-slate-800 pb-2">
            System Activity Log
          </h4>

          <div className="space-y-5">

            {logsData?.map((log) => (

              <div
                key={log.id}
                className="text-xs space-y-1 font-semibold"
              >

                <p className="text-slate-700 leading-snug tracking-wide">
                  {log.text}
                </p>

                <span className="text-[10px] text-slate-400 font-medium block">
                  {log.time}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* ===================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ===================================================== */}

      {staffToDelete && (

        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Background overlay */}

          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />


          {/* Modal */}

          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-fadeIn">

            {/* Close button */}

            <button
              onClick={handleCancelDelete}
              disabled={deletingId === staffToDelete.id}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >

              <X className="w-4 h-4" />

            </button>


            {/* Icon */}

            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">

              <Trash2 className="w-5 h-5 text-rose-600" />

            </div>


            {/* Heading */}

            <h3 className="text-lg font-bold text-slate-800">
              Delete Staff Member?
            </h3>


            {/* Description */}

            <p className="mt-2 text-sm text-slate-500 leading-relaxed">

              You are about to permanently delete{' '}

              <span className="font-semibold text-slate-800">
                {staffToDelete.name}
              </span>

              . Their application account and login access will also be removed.

            </p>


            {/* Buttons */}

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={handleCancelDelete}
                disabled={deletingId === staffToDelete.id}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                onClick={handleConfirmDelete}
                disabled={deletingId === staffToDelete.id}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >

                {deletingId === staffToDelete.id ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Staff
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}