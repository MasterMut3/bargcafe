import React from "react";

function formatPrice(amount) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export default function MenuGrid({ items, categories, selectedCategory, onAdd }) {
  const activeIds = new Set(categories.filter((c) => c.active).map((c) => c.id));

  const visible = items
    .filter((i) => i.available && activeIds.has(i.categoryId))
    .filter((i) => selectedCategory === "all" || i.categoryId === selectedCategory)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (visible.length === 0) {
    return (
      <div className="vintage-card-mobile p-4 rounded-lg text-center text-xs text-brand-wood-light">
        فعلاً آیتمی در این دسته موجود نیست.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {visible.map((item) => (
        <article
          key={item.id}
          className="vintage-card-mobile p-3 rounded-lg flex items-center justify-between gap-2"
        >
          <div className="text-right min-w-0">
            <h4 className="font-bold text-brand-green text-xs truncate">{item.name}</h4>
            <p className="text-[10px] text-brand-wood-light">{item.description}</p>
          </div>

          <button
            onClick={() => onAdd(item)}
            className="text-[11px] font-bold text-brand-wood bg-brand-cream border border-brand-gold px-2 py-1 rounded shrink-0 hover:bg-brand-gold hover:text-brand-cream transition-colors"
          >
            {formatPrice(item.price)}
          </button>
        </article>
      ))}
    </div>
  );
}