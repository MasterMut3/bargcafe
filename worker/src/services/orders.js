import {
  createOrder,
  createOrderItem,
} from "../models/index.js";

import { items } from "../data/menu.js";

export function createOrderFromRequest({
  id,
  customerName,
  customerPhone = null,
  notes = "",
  requestedItems,
}) {
  if (!customerName?.trim()) {
    throw new Error("customerName is required");
  }

  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const orderItems = requestedItems.map(({ itemId, quantity }) => {
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      throw new Error(`Item not found: ${itemId}`);
    }

    if (!item.available) {
      throw new Error(`Item is unavailable: ${item.name}`);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for item: ${itemId}`);
    }

    return createOrderItem({
      itemId: item.id,
      name: item.name,
      quantity,
      unitPrice: item.price,
    });
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return createOrder({
    id,
    customerName: customerName.trim(),
    customerPhone: customerPhone?.trim() || null,
    items: orderItems,
    total,
    notes,
  });
}