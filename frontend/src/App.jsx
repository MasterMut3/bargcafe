import { useState } from "react";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import MobileDrawer from "./components/MobileDrawer";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import MenuGrid from "./components/MenuGrid";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import SearchModal from "./components/SearchModal";
import ReserveModal from "./components/ReserveModal";

import categories from "../../content/categories.json";
import menuItems from "../../content/items.json";

import "./styles/cafebarg.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  function addToCart(item) {
    if (!item) {
      setSelectedCategory("all");
      return;
    }
    setCartItems((current) => [...current, item]);
    setCartOpen(true);
  }

  function removeFromCart(index) {
    setCartItems((current) => current.filter((_, i) => i !== index));
  }

  function selectCategory(categoryId) {
    setSelectedCategory(categoryId);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen pb-24 pt-16 px-3 space-y-6" dir="rtl">
      <Header
        onSearch={() => setSearchOpen(true)}
        onCart={() => setCartOpen(true)}
        onMenu={() => setDrawerOpen(true)}
      />

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onReserve={() => setReserveOpen(true)}
      />

      <main className="space-y-6">
        <Hero onReserve={() => setReserveOpen(true)} />

        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={selectCategory}
        />

        <MenuGrid
          items={menuItems}
          categories={categories}
          selectedCategory={selectedCategory}
          onAdd={addToCart}
        />

        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <Navigation onReserve={() => setReserveOpen(true)} />

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
          categories={categories}
          onClose={() => setSearchOpen(false)}
          onAdd={addToCart}
        />
      )}

      <ReserveModal open={reserveOpen} onClose={() => setReserveOpen(false)} />
    </div>
  );
}

export default App;