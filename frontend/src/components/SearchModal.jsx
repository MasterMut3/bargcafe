import { useMemo, useState } from "react";

function SearchModal({
  items,
  onClose,
  onAdd,
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim();

    if (!normalized) {
      return [];
    }

    return items.filter((item) =>
      `${item.name} ${item.description}`
        .includes(normalized)
    );
  }, [items, query]);

  return (
    <div className="modal-backdrop">
      <div className="search-modal">
        <div className="drawer-header">
          <div>
            <span className="section-kicker">
              جستجو
            </span>

            <h2>در کافه برگ بگرد</h2>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="مثلاً لاته..."
          className="search-input"
        />

        <div className="search-results">
          {query && results.length === 0 && (
            <p>موردی پیدا نشد.</p>
          )}

          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              className="search-result"
              onClick={() => {
                onAdd(item);
                onClose();
              }}
            >
              <span>{item.name}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;