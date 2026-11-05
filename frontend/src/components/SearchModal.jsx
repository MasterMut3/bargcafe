import React, { useState } from "react";

function formatPrice(amount) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export default function SearchModal({ items, categories, onClose, onAdd }) {
  const [query, setQuery] = useState("");

  const activeIds = new Set(categories.filter((c) => c.active).map((c) => c.id));

  const results = items
    .filter((i) => i.available && activeIds.has(i.categoryId))
    .filter((i) =>
      query.trim()
        ? i.name.includes(query.trim()) || i.description.includes(query.trim())
        : true
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-20">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-brand-cream w-full max-w-md rounded-lg p-4 border-2 border-brand-green shadow-2xl space-y-3 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-brand-green/20 pb-2">
          <i className="fa-solid fa-magnifying-glass text-brand-gold" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی آیتم..."
            className="flex-1 bg-transparent text-xs focus:outline-none"
          />
          <button onClick={onClose} aria-label="بستن">
            <i className="fa-solid fa-xmark text-brand-green" />
          </button>
        </div>

        {results.length === 0 ? (
          <p className="text-xs text-center text-brand-wood-light py-4">نتیجه‌ای یافت نشد.</p>
        ) : (
          <ul className="space-y-2">
            {results.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between gap-2 border-b border-brand-green/10 pb-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-brand-green truncate">{it.name}</div>
                  <div className="text-[10px] text-brand-wood-light">{it.description}</div>
                </div>
                <button
                  onClick={() => { onAdd(it); onClose(); }}
                  className="text-[11px] font-bold text-brand-wood bg-brand-cream border border-brand-gold px-2 py-1 rounded shrink-0"
                >
                  {formatPrice(it.price)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}