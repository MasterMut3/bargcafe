import {
  createCategory,
  createItem,
} from "../models/index.js";

export const categories = [
  createCategory({
    id: "coffee",
    name: "قهوه",
    description: "اسپرسو، لاته و قهوه‌های کافه برگ",
    sortOrder: 1,
  }),

  createCategory({
    id: "tea",
    name: "چای و دمنوش",
    description: "چای‌های گرم و دمنوش‌های آرامش‌بخش",
    sortOrder: 2,
  }),

  createCategory({
    id: "cold",
    name: "نوشیدنی سرد",
    description: "نوشیدنی‌های خنک برای روزهای گرم",
    sortOrder: 3,
  }),

  createCategory({
    id: "dessert",
    name: "دسر",
    description: "چیزکیک، کیک و شیرینی‌های کافه",
    sortOrder: 4,
  }),
];

export const items = [
  createItem({
    id: "espresso",
    categoryId: "coffee",
    name: "اسپرسو",
    description: "اسپرسوی خالص با عطر و طعم عمیق",
    price: 75000,
  }),

  createItem({
    id: "latte",
    categoryId: "coffee",
    name: "کافه لاته",
    description: "اسپرسو، شیر بخار داده شده و فوم نرم",
    price: 95000,
  }),

  createItem({
    id: "americano",
    categoryId: "coffee",
    name: "آمریکانو",
    description: "اسپرسو با آب داغ، ساده و خوش‌عطر",
    price: 85000,
  }),

  createItem({
    id: "cinnamon-tea",
    categoryId: "tea",
    name: "چای دارچین",
    description: "چای سیاه با عطر گرم دارچین",
    price: 65000,
  }),

  createItem({
    id: "calm-tea",
    categoryId: "tea",
    name: "دمنوش آرامش",
    description: "ترکیبی از گیاهان معطر و آرامش‌بخش",
    price: 70000,
  }),

  createItem({
    id: "iced-latte",
    categoryId: "cold",
    name: "آیس لاته",
    description: "لاته خنک با یخ و شیر تازه",
    price: 95000,
  }),

  createItem({
    id: "mojito",
    categoryId: "cold",
    name: "موهیتو",
    description: "نعناع تازه، لیمو و نوشیدنی خنک",
    price: 90000,
  }),

  createItem({
    id: "cheesecake",
    categoryId: "dessert",
    name: "چیزکیک",
    description: "چیزکیک خامه‌ای با بافت نرم",
    price: 100000,
  }),

  createItem({
    id: "chocolate-cake",
    categoryId: "dessert",
    name: "کیک شکلاتی",
    description: "کیک شکلاتی غلیظ و تازه",
    price: 95000,
  }),
];