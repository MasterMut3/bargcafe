function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

function MenuCard({ item, onAdd }) {
  return (
    <article className="menu-card">
      <div className="menu-image">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
          />
        ) : (
          <span>☕</span>
        )}
      </div>

      <div className="menu-card-content">
        <div className="menu-card-top">
          <h3>{item.name}</h3>

          <strong className="price">
            {formatPrice(item.price)}
            <small> تومان</small>
          </strong>
        </div>

        <p>{item.description}</p>

        <button
          type="button"
          className="add-button"
          onClick={() => onAdd(item)}
        >
          افزودن به سفارش
        </button>
      </div>
    </article>
  );
}

export default MenuCard;