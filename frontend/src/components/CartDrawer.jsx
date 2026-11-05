import React from "react";

function formatPrice(amount) {
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

export default function CartDrawer({ items, onClose, onRemove }) {
  const subtotal = items.reduce((sum, it) => sum + it.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative bg-brand-cream w-full max-w-md rounded-t-2xl sm:rounded-lg p-5 border-t-4 border-brand-gold shadow-2xl space-y-4 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-brand-green/20 pb-2">
          <h3 className="font-heading text-lg text-brand-green">سبد شما</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-brand-green text-brand-green flex items-center justify-center"
            aria-label="بستن"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-xs text-center text-brand-wood-light py-6">سبد خرید شما خالی است.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {items.map((it, index) => (
                <li
                  key={`${it.id}-${index}`}
                  className="flex items-center justify-between gap-2 border-b border-brand-green/10 pb-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-brand-green truncate">{it.name}</div>
                    <div className="text-[10px] text-brand-wood-light">{formatPrice(it.price)}</div>
                  </div>
                  <button
                    onClick={() => onRemove(index)}
                    className="w-6 h-6 rounded text-rose-700 shrink-0"
                    aria-label="حذف"
                  >
                    <i className="fa-solid fa-trash text-[10px]" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-2 border-t border-brand-green/20">
              <span className="text-xs font-bold text-brand-green">جمع</span>
              <span className="text-sm font-bold text-brand-green">{formatPrice(subtotal)}</span>
            </div>

            <button className="w-full vintage-btn-mobile text-brand-cream rounded font-bold text-xs">
              ثبت سفارش
            </button>
          </>
        )}
      </div>
    </div>
  );
}