let products = [];
const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartContent = document.getElementById("cartContent");
const cartCountElement = document.getElementById("cartCount");
const cartTotalElement = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.getElementById("productSearch");
const clearSearchButton = document.getElementById("clearSearch");
const searchBtn = document.getElementById("productSearchBtn");
const suggestionsEl = document.getElementById("searchSuggestions");
let stripe = null;
let currentCategory = "all";
let currentSearch = "";

function getRhymeKey(word) {
  if (!word) return "";
  const s = word.toLowerCase().replace(/[^a-z]/g, "");
  // fallback: last 3 letters
  if (s.length <= 3) return s;
  return s.slice(-3);
}

function computeSuggestionScore(product, q) {
  const name = product.name.toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const ql = q.toLowerCase();
  let score = 0;
  if (name.includes(ql)) score += 30;
  if (desc.includes(ql)) score += 15;
  if (ql.length === 1 && name.includes(ql)) score += 20; // single-letter boost
  // rhyme-like: compare last 3 letters
  if (ql.length >= 1) {
    const qRhy = getRhymeKey(ql);
    if (getRhymeKey(name) === qRhy) score += 12;
    if (getRhymeKey(desc) === qRhy) score += 6;
  }
  return score;
}

function clearSuggestions() {
  if (suggestionsEl) suggestionsEl.innerHTML = "";
}

function renderSuggestions(list, q) {
  if (!suggestionsEl) return;
  suggestionsEl.innerHTML = "";
  if (!list || list.length === 0) return;
  for (const p of list) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "search-suggestion";
    item.setAttribute("role", "option");
    item.innerHTML = `<span class=\"s-name\">${highlightText(p.name, q)}</span> <span class=\"s-cat\">${p.category}</span>`;
    item.addEventListener("click", () => {
      if (searchInput) searchInput.value = p.name;
      doSearch(p.name);
    });
    suggestionsEl.appendChild(item);
  }
}

function updateSuggestions(q) {
  const qnorm = (q || "").trim();
  if (!qnorm) {
    clearSuggestions();
    return;
  }
  const scores = products.map((p) => ({ p, score: computeSuggestionScore(p, qnorm) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((s) => s.p);
  renderSuggestions(scores, qnorm);
}

function doSearch(q) {
  currentSearch = q || (searchInput ? searchInput.value : "");
  renderProducts(currentCategory, currentSearch);
  clearSuggestions();
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text, query) {
  const normalized = query.trim();
  if (!normalized) return text;
  const escaped = escapeRegExp(normalized);
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

async function loadProducts() {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to load products.");
  }
  products = await response.json();
}

function renderProducts(filter = "all", searchQuery = "", limit = null) {
  productGrid.innerHTML = "";
  let normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = filter === "all" || product.category === filter;
    const matchesSearch =
      normalizedSearch === "" ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  const toRender = limit ? filtered.slice(0, limit) : filtered;

  if (toRender.length === 0) {
    productGrid.innerHTML = `<p class="empty-cart">No products match your search or selected category.</p>`;
    return;
  }

  for (const product of toRender) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-body">
        <div>
          <h3>${highlightText(product.name, searchQuery)}</h3>
          <p>${highlightText(product.description, searchQuery)}</p>
        </div>
        <div class="product-actions">
          <div class="price">${formatPrice(product.price)}</div>
          <div class="qty-row">
            <div class="qty-controls" data-product-id="${product.id}">
              <button class="qty-btn" data-decrease="${product.id}" aria-label="Decrease quantity">−</button>
              <input class="qty-input" data-qty-input="${product.id}" type="number" value="1" min="1" />
              <button class="qty-btn" data-increase="${product.id}" aria-label="Increase quantity">+</button>
            </div>
            <button class="button button-secondary add-to-cart" data-product-id="${product.id}">Add to cart</button>
          </div>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  }
}

function updateCartCount() {
  const totalQuantity = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalQuantity;
}

function updateCartPanel() {
  cartContent.innerHTML = "";
  if (cart.size === 0) {
    cartContent.innerHTML = '<p class="empty-cart">Your cart is empty. Add products to get started.</p>';
    cartTotalElement.textContent = "$0.00";
    return;
  }

  let total = 0;
  for (const item of cart.values()) {
    total += item.product.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h4>${item.product.name}</h4>
        <div class="cart-qty-row">
          <button class="qty-btn" data-dec-cart="${item.product.id}" aria-label="Decrease">−</button>
          <span class="cart-qty" data-cart-qty="${item.product.id}">${item.quantity}</span>
          <button class="qty-btn" data-inc-cart="${item.product.id}" aria-label="Increase">+</button>
          <span class="cart-line-price">${formatPrice(item.product.price)}</span>
        </div>
      </div>
      <div>
        <button type="button" data-remove-id="${item.product.id}">Remove</button>
      </div>
    `;
    cartContent.appendChild(row);
  }

  cartTotalElement.textContent = formatPrice(total);
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("visible");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
  cartPanel.setAttribute("aria-hidden", "true");
}

async function fetchStripeConfig() {
  const response = await fetch("/config");
  const data = await response.json();
  stripe = Stripe(data.publishableKey);
}

async function createCheckoutSession() {
  if (!stripe) {
    await fetchStripeConfig();
  }

  const items = Array.from(cart.values()).map((item) => ({
    id: item.product.id,
    quantity: item.quantity,
  }));

  const response = await fetch("/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();
  if (data.url) {
    window.location = data.url;
  } else {
    throw new Error(data.error || "Unable to create checkout session.");
  }
}

productGrid.addEventListener("click", (event) => {
  const increaseBtn = event.target.closest("button[data-increase]");
  const decreaseBtn = event.target.closest("button[data-decrease]");
  const addBtn = event.target.closest("button.add-to-cart");

  if (increaseBtn) {
    const id = Number(increaseBtn.dataset.increase);
    const input = document.querySelector(`input[data-qty-input="${id}"]`);
    if (input) input.value = Math.max(1, Number(input.value) + 1);
    return;
  }

  if (decreaseBtn) {
    const id = Number(decreaseBtn.dataset.decrease);
    const input = document.querySelector(`input[data-qty-input="${id}"]`);
    if (input) input.value = Math.max(1, Number(input.value) - 1);
    return;
  }

  if (addBtn) {
    const id = Number(addBtn.dataset.productId);
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const input = document.querySelector(`input[data-qty-input="${id}"]`);
    const qty = input ? Math.max(1, Number(input.value)) : 1;

    const cartItem = cart.get(id) || { product, quantity: 0 };
    cartItem.quantity += qty;
    cart.set(id, cartItem);
    updateCartCount();
    updateCartPanel();
    openCart();
  }
});

cartContent.addEventListener("click", (event) => {
  const removeButton = event.target.closest("button[data-remove-id]");
  const incBtn = event.target.closest("button[data-inc-cart]");
  const decBtn = event.target.closest("button[data-dec-cart]");

  if (removeButton) {
    const id = Number(removeButton.dataset.removeId);
    cart.delete(id);
    updateCartCount();
    updateCartPanel();
    return;
  }

  if (incBtn) {
    const id = Number(incBtn.dataset.incCart);
    const item = cart.get(id);
    if (!item) return;
    item.quantity += 1;
    cart.set(id, item);
    updateCartCount();
    updateCartPanel();
    return;
  }

  if (decBtn) {
    const id = Number(decBtn.dataset.decCart);
    const item = cart.get(id);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity - 1);
    cart.set(id, item);
    updateCartCount();
    updateCartPanel();
    return;
  }
});

cartToggle.addEventListener("click", () => {
  if (cartPanel.classList.contains("open")) {
    closeCartPanel();
  } else {
    openCart();
  }
});

closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);
checkoutButton.addEventListener("click", async () => {
  if (cart.size === 0) {
    alert("Add products to your cart before checkout.");
    return;
  }
  checkoutButton.disabled = true;
  checkoutButton.textContent = "Redirecting...";

  try {
    await createCheckoutSession();
  } catch (error) {
    alert(error.message || "Unable to start checkout.");
    checkoutButton.disabled = false;
    checkoutButton.textContent = "Checkout";
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.category;
    renderProducts(currentCategory, currentSearch);
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    currentSearch = event.target.value;
    // show suggestions (ignore minSearchLength for suggestions)
    updateSuggestions(currentSearch);
    renderProducts(currentCategory, currentSearch);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doSearch();
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => doSearch());
}

if (clearSearchButton) {
  clearSearchButton.addEventListener("click", () => {
    currentSearch = "";
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    clearSuggestions();
    renderProducts(currentCategory, currentSearch);
  });
}


async function initializeStorefront() {
  try {
    await loadProducts();
    renderProducts("all", "", 6); // Limit to 6 products on home page
    updateCartPanel();
    updateCartCount();
  } catch (error) {
    productGrid.innerHTML = `<p class="empty-cart">Unable to load product catalog. Please try again later.</p>`;
    console.error(error);
  }
}

function showCheckoutMessage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("success")) {
    alert("Payment complete! Thank you for your order.");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  if (params.get("canceled")) {
    alert("Checkout canceled. You can continue shopping anytime.");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

initializeStorefront();
showCheckoutMessage();
