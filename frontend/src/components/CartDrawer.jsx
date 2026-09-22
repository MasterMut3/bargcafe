function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function CartDrawer({
  items,
  onClose,
  onRemove,
}) {
  const total = items.reduce(
    (sum, item) => sum + item.price,
    0
  );

  return (
    <>
      <div
        className="drawer-backdrop"
        onClick={onClose}
      />

      <aside className="cart-drawer">
        <div className="drawer-header">
          <div>
            <span className="section-kicker">
              سفارش شما
            </span>

            <h2>سبد سفارش</h2>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <span>🛒</span>
              <p>هنوز چیزی انتخاب نکرده‌اید.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                className="cart-item"
                key={`${item.id}-${index}`}
              >
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {formatPrice(item.price)} تومان
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                >
                  حذف
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>مجموع</span>
            <strong>
              {formatPrice(total)} تومان
            </strong>
          </div>

          <button
            type="button"
            className="primary-button full-width"
            disabled={items.length === 0}
          >
            ادامه سفارش
          </button>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;