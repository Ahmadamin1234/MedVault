import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import CategoryPills from "../components/CategoryPills";
import InventoryTable from "../components/InventoryTable";
import AddMedicationForm from "../components/AddMedicationForm";
import { getMedications, deleteMedication } from "../data/authApi";
import { useOutletContext } from "react-router-dom";
import DeleteMedicationModal from "../components/DeleteMedicationModal";
import EditMedicationForm from "../components/EditMedicationForm";
export default function InventoryPage() {
  const [inventoryList, setInventoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Drugs");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [medicationToDelete , setMedicationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setHeaderOverride } = useOutletContext();
  const [medicationToEdit, setMedicationToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    "All Drugs",
    "Antibiotics",
    "Painkillers",
    "Anesthetics",
    "Cardiology",
    "Vitamins",
    "Surgicals",
  ];

  useEffect(() => {
    getMedications()
      .then((medications) => {
        setInventoryList(medications);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching inventory catalog database:", err);
        setLoading(false);
      });
  }, []);

  // Intercept view context updates to mutate parent top-bar text nodes safely
  const toggleFormView = (shouldOpenForm) => {
    setIsAddingNew(shouldOpenForm);
    if (shouldOpenForm) {
      setHeaderOverride("Add New Medication"); // Updates heading exactly when opening the entry form sheet
    } else {
      setHeaderOverride(""); // Resets back down to match default App tab context labels
    }
  };

  const filteredInventory = inventoryList.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Drugs" ||
      item.category === selectedCategory ||
      (selectedCategory === "Cardiology" && item.category === "Cardiac");

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generic.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
const handleDelete = async () => {
  if (!medicationToDelete) return;

  setIsDeleting(true);

  try {
    await deleteMedication(medicationToDelete.id);

    setInventoryList((currentList) =>
      currentList.filter(
        (item) => item.id !== medicationToDelete.id
      )
    );

    setMedicationToDelete(null);

  } catch (error) {
    console.error("Failed to delete medication:", error);

    alert(
      error.message || "Failed to delete medication."
    );

  } finally {
    setIsDeleting(false);
  }
};
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50">
        <div className="text-teal-600 font-semibold animate-pulse text-sm">
          Fetching Secure Catalog Registry...
        </div>
      </div>
    );
  }

  return (
    <main className="h-full overflow-y-auto p-8 bg-slate-50 space-y-6">
      {isAddingNew ? (
        <AddMedicationForm
          onCancel={() => toggleFormView(false)}
          onCreated={async () => {
            const medications = await getMedications();
            setInventoryList(medications);
            toggleFormView(false);
          }}
        />
      ) :isEditing ?(
        <EditMedicationForm medication={medicationToEdit}
          onCancel={()=>{
          setMedicationToEdit(null);
          setIsEditing(false);
          setHeaderOverride("");
        }}
        onUpdated={async () => {
          const medication = await getMedications();
          setInventoryList(medication);
          setMedicationToEdit(null);
          setIsEditing(false);
          setHeaderOverride("");
        }}/>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <CategoryPills
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <button
              onClick={() => toggleFormView(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New Drug
            </button>
          </div>

          <InventoryTable
            data={filteredInventory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onEdit={(item) =>{
              setMedicationToEdit(item);
              setIsEditing(true);
              setHeaderOverride("Edit Medication");
            }}
            onDelete={(item)=> setMedicationToDelete(item)}
          />
        </>
      )}
      <DeleteMedicationModal
      medication={medicationToDelete}
      onCancel={() => setMedicationToDelete(null)}
      onConfirm={handleDelete}
      isDeleting={isDeleting}
    />
    </main>
  );
}
