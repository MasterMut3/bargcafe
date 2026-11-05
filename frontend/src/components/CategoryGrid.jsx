import React from "react";

export default function CategoryGrid({ categories, selectedCategory, onSelect }) {
  const active = categories
    .filter((c) => c.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const tabs = [{ id: "all", name: "همه" }, ...active];

  return (
    <section id="menu" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-heading text-xl text-brand-green flex items-center gap-1.5">
          <i className="fa-solid fa-mug-hot text-brand-gold text-base" />
          <span>منوی کافه برگ</span>
        </h2>
        <span className="text-[11px] text-brand-gold-dark font-medium">تازه‌پز و روزانه</span>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        {tabs.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 px-3 py-2 rounded-md font-bold border transition-colors ${
                isActive
                  ? "bg-brand-green text-brand-cream border-brand-gold"
                  : "bg-brand-cream-paper text-brand-green border-brand-green"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}