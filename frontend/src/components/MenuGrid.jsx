import MenuCard from "./MenuCard";

function MenuGrid({
  items,
  selectedCategory,
  onAdd,
}) {
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <section className="section menu-section" id="menu">
      <div className="section-heading">
        <div>
          <span className="section-kicker">منوی امروز</span>

          <h2>انتخاب کن، سفارش بده</h2>
        </div>

        <div className="menu-filter">
          <button
            type="button"
            className={
              selectedCategory === "all"
                ? "active"
                : ""
            }
            onClick={() => onAdd(null)}
          >
            همه
          </button>
        </div>
      </div>

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onAdd={onAdd}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          موردی در این دسته پیدا نشد.
        </div>
      )}
    </section>
  );
}

export default MenuGrid;