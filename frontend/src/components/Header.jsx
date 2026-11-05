import React from "react";

export default function Header({ onSearch, onCart, onMenu }) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b-2 border-brand-green px-4 py-2.5 flex items-center justify-between shadow-sm">
      <a href="#home" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded bg-brand-cream-paper border-2 border-brand-green flex items-center justify-center">
          <svg className="w-6 h-6 text-brand-green" viewBox="0 0 100 100" fill="currentColor">
            <path
              d="M 85 15 C 50 15, 20 40, 20 80 C 25 80, 35 78, 45 70 C 65 55, 80 35, 85 15 Z M 20 80 C 40 55, 60 35, 80 20"
              stroke="currentColor"
              strokeWidth="3"
              fill="#2D4A3E"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-xl text-brand-green leading-tight">کافه برگ</span>
          <span className="text-[9px] text-brand-gold-dark font-bold tracking-widest uppercase -mt-0.5">
            LEAF CAFÉ • 1374
          </span>
        </div>
      </a>

      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className="w-10 h-10 rounded-full border border-brand-gold bg-brand-green text-brand-gold flex items-center justify-center text-sm shadow"
          aria-label="جستجو"
        >
          <i className="fa-solid fa-magnifying-glass" />
        </button>
        <button
          onClick={onCart}
          className="w-10 h-10 rounded-full border border-brand-gold bg-brand-green text-brand-gold flex items-center justify-center text-sm shadow"
          aria-label="سبد خرید"
        >
          <i className="fa-solid fa-bag-shopping" />
        </button>
        <button
          onClick={onMenu}
          className="w-10 h-10 rounded border-2 border-brand-green text-brand-green flex items-center justify-center text-lg active:bg-brand-green active:text-brand-cream"
          aria-label="منو"
        >
          <i className="fa-solid fa-bars" />
        </button>
      </div>
    </header>
  );
}