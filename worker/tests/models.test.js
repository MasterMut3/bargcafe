import { describe, expect, it } from "vitest";

import {
  createCategory,
  createItem,
  createOrder,
  createOrderItem,
} from "../src/models/index.js";

describe("models", () => {
  it("creates a category", () => {
    const category = createCategory({
      id: "coffee",
      name: "قهوه",
    });

    expect(category).toEqual({
      id: "coffee",
      name: "قهوه",
      description: "",
      image: null,
      sortOrder: 0,
      active: true,
    });
  });

  it("creates an item", () => {
    const item = createItem({
      id: "espresso",
      categoryId: "coffee",
      name: "اسپرسو",
      price: 75000,
    });

    expect(item).toEqual({
      id: "espresso",
      categoryId: "coffee",
      name: "اسپرسو",
      description: "",
      price: 75000,
      image: null,
      available: true,
      sortOrder: 0,
    });
  });

  it("creates an order", () => {
    const orderItem = createOrderItem({
      itemId: "espresso",
      name: "اسپرسو",
      quantity: 2,
      unitPrice: 75000,
    });

    const order = createOrder({
      id: "ORD-001",
      customerName: "سهیل",
      items: [orderItem],
      total: 150000,
    });

    expect(order.status).toBe("pending");
    expect(order.items).toHaveLength(1);
    expect(order.total).toBe(150000);
  });
});