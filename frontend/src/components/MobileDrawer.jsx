import React from "react";

const links = [
  { href: "#home",    icon: "fa-house",            label: "صفحه اصلی" },
  { href: "#menu",    icon: "fa-book-open",        label: "منوی کامل کافه" },
  { href: "#about",   icon: "fa-store",            label: "درباره کافه برگ" },
  { href: "#contact", icon: "fa-map-location-dot", label: "آدرس و اطلاعات تماس" },
];

export default function MobileDrawer({ open, onClose, onReserve }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-brand-cream z-50 border-l-4 border-brand-gold shadow-2xl transform transition-transform duration-300 flex flex-col justify-between p-5 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between border-b-2 border-brand-green/20 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-leaf text-brand-green text-xl" />
              <span className="font-heading text-xl text-brand-green">منوی دسترسی سریع</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded border border-brand-green text-brand-green flex items-center justify-center"
              aria-label="بستن"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <nav className="space-y-2 text-right">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-lg text-brand-green font-medium hover:bg-brand-green/10 active:bg-brand-green active:text-brand-cream"
              >
                <i className={`fa-solid ${l.icon} w-5 text-brand-gold`} />
                <span>{l.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-brand-green/20 text-center">
          <button
            onClick={() => { onClose(); onReserve(); }}
            className="w-full vintage-btn-mobile text-brand-cream rounded font-bold text-sm flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-chair text-brand-gold" />
            <span>رزرو آنلاین میز</span>
          </button>
          <p className="text-[10px] text-brand-wood-light">ساعات کاری: ۸:۰۰ الی ۲۳:۳۰</p>
        </div>
      </aside>
    </>
  );
}