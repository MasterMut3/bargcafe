import { useState } from "react";

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import MenuGrid from "./components/MenuGrid";
import SpecialSection from "./components/SpecialSection";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";

import {
  categories,
  menuItems,
} from "./data/menu";

import "./styles/cafebarg.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  function addToCart(item) {
    if (!item) {
      setSelectedCategory("all");
      return;
    }

    setCartItems((current) => [
      ...current,
      item,
    ]);

    setCartOpen(true);
  }

  function removeFromCart(index) {
    setCartItems((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  function selectCategory(categoryId) {
    setSelectedCategory(categoryId);

    document
      .getElementById("menu")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  return (
    <div className="page-shell">
      <div className="site">
        <Header
          onSearch={() => setSearchOpen(true)}
          onCart={() => setCartOpen(true)}
        />

        <Navigation />

        <main>
          <Hero />

          <CategoryGrid
            categories={categories}
            onSelect={selectCategory}
          />

          <MenuGrid
            items={menuItems}
            selectedCategory={selectedCategory}
            onAdd={addToCart}
          />

          <SpecialSection />
        </main>

        <Footer />

        {cartOpen && (
          <CartDrawer
            items={cartItems}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
          />
        )}

        {searchOpen && (
          <SearchModal
            items={menuItems}
            onClose={() => setSearchOpen(false)}
            onAdd={addToCart}
          />
        )}
      </div>
    </div>
  );
}

export default App;