// Shared cart management with localStorage persistence
class CartManager {
  constructor() {
    this.cart = new Map();
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('novaedge-cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cart.clear();
        parsed.forEach(item => {
          this.cart.set(item.product.id, item);
        });
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
      this.cart.clear();
    }
  }

  saveToStorage() {
    try {
      const data = Array.from(this.cart.values());
      localStorage.setItem('novaedge-cart', JSON.stringify(data));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }

  addItem(product, quantity = 1) {
    if (this.cart.has(product.id)) {
      const item = this.cart.get(product.id);
      item.quantity += quantity;
    } else {
      this.cart.set(product.id, { product, quantity });
    }
    this.saveToStorage();
  }

  removeItem(productId) {
    this.cart.delete(productId);
    this.saveToStorage();
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else if (this.cart.has(productId)) {
      this.cart.get(productId).quantity = quantity;
      this.saveToStorage();
    }
  }

  getCart() {
    return this.cart;
  }

  getCartSize() {
    return this.cart.size;
  }

  getTotalItems() {
    return Array.from(this.cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice() {
    return Array.from(this.cart.values()).reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  clearCart() {
    this.cart.clear();
    this.saveToStorage();
  }

  isEmpty() {
    return this.cart.size === 0;
  }
}

// Global cart instance
const cartManager = new CartManager();
