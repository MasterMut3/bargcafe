import React, { useState } from "react";

export default function ReserveModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-brand-cream w-full max-w-md rounded-t-2xl sm:rounded-lg p-5 border-t-4 border-brand-gold shadow-2xl space-y-4 animate-slide-up">
        <div className="flex items-center justify-between border-b border-brand-green/20 pb-2">
          <div className="flex items-center gap-2 text-brand-green">
            <i className="fa-solid fa-chair text-brand-gold" />
            <h3 className="font-heading text-lg">رزرو آنلاین میز</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-brand-green text-brand-green flex items-center justify-center"
            aria-label="بستن"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-right">
          <div>
            <label className="block text-[11px] font-bold text-brand-green mb-1">نام شما:</label>
            <input
              type="text"
              required
              placeholder="مثال: مریم احمدی"
              className="w-full px-3 py-2 text-xs rounded border border-brand-green/40 bg-brand-cream-paper focus:outline-none focus:border-brand-gold min-h-[40px]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-brand-green mb-1">شماره همراه:</label>
            <input
              type="tel"
              required
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              className="w-full px-3 py-2 text-xs rounded border border-brand-green/40 bg-brand-cream-paper focus:outline-none focus:border-brand-gold min-h-[40px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-brand-green mb-1">زمان حضور:</label>
              <select className="w-full px-2 py-2 text-xs rounded border border-brand-green/40 bg-brand-cream-paper focus:outline-none focus:border-brand-gold min-h-[40px]">
                <option>امروز - عصر</option>
                <option>امروز - شب</option>
                <option>فردا</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-brand-green mb-1">تعداد نفرات:</label>
              <select defaultValue="2" className="w-full px-2 py-2 text-xs rounded border border-brand-green/40 bg-brand-cream-paper focus:outline-none focus:border-brand-gold min-h-[40px]">
                <option value="1">۱ نفر</option>
                <option value="2">۲ نفر</option>
                <option value="4">۳ یا ۴ نفر</option>
                <option value="6">دورهمی (۵+ نفر)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="w-full vintage-btn-mobile text-brand-cream rounded font-bold text-xs mt-2">
            ثبت رزرو میز
          </button>
        </form>

        {submitted && (
          <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded text-xs text-center font-bold">
            ✓ رزرو شما ثبت شد. به زودی با شما تماس می‌گیریم!
          </div>
        )}
      </div>
    </div>
  );
}