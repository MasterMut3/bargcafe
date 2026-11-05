import React from "react";

export default function Navigation({ onReserve }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-brand-cream border-t-2 border-brand-green z-40 px-2 py-1.5 shadow-lg flex items-center justify-around">
      <a href="#home" className="flex flex-col items-center gap-0.5 text-brand-green p-1 active:text-brand-gold">
        <i className="fa-solid fa-house text-base" />
        <span className="text-[10px] font-bold">خانه</span>
      </a>

      <a href="#menu" className="flex flex-col items-center gap-0.5 text-brand-green p-1 active:text-brand-gold">
        <i className="fa-solid fa-book-open text-base" />
        <span className="text-[10px] font-bold">منو</span>
      </a>

      <button
        onClick={onReserve}
        className="flex flex-col items-center gap-0.5 text-brand-green p-1 active:text-brand-gold"
      >
        <i className="fa-solid fa-chair text-base" />
        <span className="text-[10px] font-bold">رزرو</span>
      </button>

      <a href="#contact" className="flex flex-col items-center gap-0.5 text-brand-green p-1 active:text-brand-gold">
        <i className="fa-solid fa-location-dot text-base" />
        <span className="text-[10px] font-bold">تماس</span>
      </a>
    </nav>
  );
}