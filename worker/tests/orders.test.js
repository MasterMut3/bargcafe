import { describe, expect, it } from "vitest";

import { createOrderFromRequest } from "../src/services/orders.js";

describe("order service", () => {
  it("creates an order and calculates the total", () => {
    const order = createOrderFromRequest({
      id: "ORD-001",
      customerName: "Soheil",
      requestedItems: [
        {
          itemId: "espresso",
          quantity: 2,
        },
        {
          itemId: "latte",
          quantity: 1,
        },
      ],
    });

    expect(order.total).toBe(245000);
    expect(order.items).toHaveLength(2);
    expect(order.items[0].unitPrice).toBe(75000);
    expect(order.status).toBe("pending");
  });

  it("rejects unknown items", () => {
    expect(() =>
      createOrderFromRequest({
        id: "ORD-002",
        customerName: "Soheil",
        requestedItems: [
          {
            itemId: "does-not-exist",
            quantity: 1,
          },
        ],
      })
    ).toThrow("Item not found: does-not-exist");
  });

  it("rejects invalid quantities", () => {
    expect(() =>
      createOrderFromRequest({
        id: "ORD-003",
        customerName: "Soheil",
        requestedItems: [
          {
            itemId: "espresso",
            quantity: 0,
          },
        ],
      })
    ).toThrow("Invalid quantity for item: espresso");
  });
});