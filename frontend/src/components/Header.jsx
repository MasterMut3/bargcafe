function Header({ onSearch, onCart }) {
  return (
    <header className="site-header">
      <div className="header-side header-side-right">
        <span>شماره ۰۱</span>
        <span>کافه برگ</span>
      </div>

      <div className="brand">
        <div className="brand-symbol">❧</div>

        <div className="brand-name">
          کافه برگ
        </div>

        <div className="brand-meta">
          CAFE BARG • EST. 2026
        </div>
      </div>

      <div className="header-side header-side-left">
        <button
          className="icon-button"
          type="button"
          onClick={onSearch}
          aria-label="جستجو"
        >
          ⌕
        </button>

        <button
          className="icon-button"
          type="button"
          onClick={onCart}
          aria-label="سبد سفارش"
        >
          🛒
        </button>
      </div>
    </header>
  );
}

export default Header;
