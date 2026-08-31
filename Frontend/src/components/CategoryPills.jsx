
export default function CategoryPills({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto max-w-4xl scrollbar-none py-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
            selectedCategory === cat
              ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
