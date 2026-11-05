import React from "react";

export default function AboutSection() {
  return (
    <section id="about">
      <div className="vintage-card-mobile p-4 rounded-lg text-right space-y-2 bg-brand-cream-paper">
        <div className="flex items-center gap-2 text-brand-green font-heading text-lg">
          <i className="fa-solid fa-leaf text-brand-gold" />
          <span>داستان مختصر کافه برگ</span>
        </div>
        <p className="text-xs text-brand-wood-light leading-relaxed">
          تأسیس ۱۳۷۴ در قلب تهران. ما در کافه برگ اصالت را با دم‌آوری دقیق قهوه‌ها و پخت روزانه کیک‌های خانگی حفظ کرده‌ایم تا هر دیدار، به خاطره‌ای ماندگار تبدیل شود.
        </p>
      </div>
    </section>
  );
}