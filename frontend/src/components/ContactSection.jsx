import React from "react";

export default function ContactSection() {
  return (
    <section id="contact" className="pb-4">
      <div className="vintage-card-mobile p-4 rounded-lg text-right space-y-3">
        <h3 className="font-heading text-lg text-brand-green border-b border-brand-gold/40 pb-1.5">
          تماس و نشانی
        </h3>

        <div className="space-y-2 text-xs text-brand-wood">
          <div className="flex items-start gap-2">
            <i className="fa-solid fa-location-dot text-brand-gold mt-0.5" />
            <span>تهران، خیابان ولیعصر، بالاتر از بهشتی، پلاک ۱۲۴۸</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-clock text-brand-gold" />
            <span>همه روزه: ۸:۰۰ صبح الی ۲۳:۳۰ شب</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-phone text-brand-gold" />
            <a href="tel:02188776655" className="font-bold underline">
              ۰۲۱-۸۸۷۷۶۶۵۵ (لمس جهت تماس)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}