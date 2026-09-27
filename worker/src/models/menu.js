export function createCategory({
  id,
  name,
  description = "",
  image = null,
  sortOrder = 0,
  active = true,
}) {
  return {
    id,
    name,
    description,
    image,
    sortOrder,
    active,
  };
}

export function createItem({
  id,
  categoryId,
  name,
  description = "",
  price,
  image = null,
  available = true,
  sortOrder = 0,
}) {
  return {
    id,
    categoryId,
    name,
    description,
    price,
    image,
    available,
    sortOrder,
  };
}