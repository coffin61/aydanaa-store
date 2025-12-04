// components/CategoryFilter.js
export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-md border transition 
            ${selected === cat 
              ? 'bg-neutral-800 text-white border-neutral-800' 
              : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}