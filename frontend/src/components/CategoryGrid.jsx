function CategoryGrid({ categories, onSelect }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">دسته‌بندی</span>
          <h2>از منوی کافه برگ</h2>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="category-card"
            onClick={() => onSelect(category.id)}
          >
            <span className="category-icon">
              {category.icon}
            </span>

            <strong>{category.title}</strong>

            <span>
              {category.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;