import React from "react";

export default function Hero({ onReserve }) {
  return (
    <section id="home" className="pt-2">
      <div className="vintage-card-mobile p-4 rounded-lg text-right relative overflow-hidden">
        <div className="inline-block bg-brand-green text-brand-cream text-[10px] font-bold px-2 py-0.5 rounded border border-brand-gold mb-2">
          اصالت دهه ۷۰ خورشیدی ☕
        </div>

        <h1 className="font-heading text-2xl text-brand-green mb-1.5 leading-tight">
          محفلی صمیمی با عطر اصیل قهوه
        </h1>

        <p className="text-brand-wood-light text-xs leading-relaxed mb-4">
          در کافه برگ، طعم نوستالژیک قهوه‌های دمی و دمنوش‌های معطر ایرانی را در فضایی آرام تجربه کنید.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <a
            href="#menu"
            className="vintage-btn-mobile text-brand-cream rounded text-xs font-bold flex items-center justify-center gap-1"
          >
            <span>مشاهده منو</span>
            <i className="fa-solid fa-arrow-left text-[10px] text-brand-gold" />
          </a>
          <button
            onClick={onReserve}
            className="border-2 border-brand-green text-brand-green rounded text-xs font-bold min-h-[44px] hover:bg-brand-green/10 active:bg-brand-green active:text-brand-cream transition-colors"
          >
            رزرو میز
          </button>
        </div>
      </div>
    </section>
  );
}