function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="eyebrow">
          کافه برگ • یک قرار کوچک با خودت
        </div>

        <h1>
          یک فنجان
          <br />
          برای حالِ خوب
        </h1>

        <p>
          قهوه، چای، دسر و لحظه‌هایی که ارزش
          آرام‌تر زندگی کردن را دارند.
        </p>

        <a href="#menu" className="primary-button">
          دیدن منو
        </a>
      </div>

      <div className="hero-art">
        <div className="hero-art-inner">
          ☕
        </div>

        <span className="hero-stamp">
          CAFE
          <br />
          BARG
        </span>
      </div>
    </section>
  );
}

export default Hero;