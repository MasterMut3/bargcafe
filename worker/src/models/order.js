export const ORDER_STATUSES = Object.freeze([
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export function createOrder({
  id,
  customerName,
  customerPhone,
  items,
  total,
  status = "pending",
  createdAt = new Date().toISOString(),
}) {
  return {
    id,
    customerName,
    customerPhone,
    items,
    total,
    status,
    createdAt,
  };
}

export function createOrderItem({
  itemId,
  name,
  quantity,
  unitPrice,
}) {
  return {
    itemId,
    name,
    quantity,
    unitPrice,
  };
}