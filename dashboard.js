// Dashboard functionality
const cartToggle = document.getElementById("cartToggle");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartContent = document.getElementById("cartContent");
const cartCountElement = document.getElementById("cartCount");
const cartTotalElement = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

const dashboardCart = document.getElementById("dashboardCart");
const dashboardTotal = document.getElementById("dashboardTotal");
const cartBadge = document.getElementById("cartBadge");
const proceedCheckout = document.getElementById("proceedCheckout");

let stripe = null;

function updateCartDisplay() {
  const cart = cartManager.getCart();
  
  // Update cart badge
  const totalItems = cartManager.getTotalItems();
  cartCountElement.textContent = totalItems;
  cartBadge.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  
  // Update dashboard cart
  dashboardCart.innerHTML = "";
  if (cart.size === 0) {
    dashboardCart.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 2rem 1rem;">Your cart is empty. <a href="products.html" style="color: var(--primary); text-decoration: none; font-weight: 600;">Start shopping</a></p>';
    proceedCheckout.disabled = true;
    proceedCheckout.style.opacity = "0.5";
    proceedCheckout.style.cursor = "not-allowed";
    return;
  }
  
  proceedCheckout.disabled = false;
  proceedCheckout.style.opacity = "1";
  proceedCheckout.style.cursor = "pointer";

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
          <span class="cart-line-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <div>
        <button type="button" data-remove-id="${item.product.id}" style="color: var(--primary); background: transparent; border: none; cursor: pointer;">Remove</button>
      </div>
    `;
    dashboardCart.appendChild(row);
  }

  dashboardTotal.textContent = `$${total.toFixed(2)}`;
  cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function updateCartPanel() {
  cartContent.innerHTML = "";
  const cart = cartManager.getCart();
  if (cart.size === 0) {
    cartContent.innerHTML = '<p class="empty-cart">Your cart is empty. Add products to get started.</p>';
    return;
  }

  for (const item of cart.values()) {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h4>${item.product.name}</h4>
        <div class="cart-qty-row">
          <button class="qty-btn" data-dec-cart="${item.product.id}" aria-label="Decrease">−</button>
          <span class="cart-qty" data-cart-qty="${item.product.id}">${item.quantity}</span>
          <button class="qty-btn" data-inc-cart="${item.product.id}" aria-label="Increase">+</button>
          <span class="cart-line-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <div>
        <button type="button" data-remove-id="${item.product.id}" style="color: var(--primary); background: transparent; border: none; cursor: pointer;">Remove</button>
      </div>
    `;
    cartContent.appendChild(row);
  }
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

  const cart = cartManager.getCart();
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

// Event listeners
cartToggle.addEventListener("click", () => {
  if (cartPanel.classList.contains("open")) {
    closeCartPanel();
  } else {
    openCart();
  }
});

closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);

// Cart item management
dashboardCart.addEventListener("click", (event) => {
  const removeButton = event.target.closest("button[data-remove-id]");
  const incBtn = event.target.closest("button[data-inc-cart]");
  const decBtn = event.target.closest("button[data-dec-cart]");

  if (removeButton) {
    const id = Number(removeButton.dataset.removeId);
    cartManager.removeItem(id);
    updateCartDisplay();
    updateCartPanel();
    return;
  }

  if (incBtn) {
    const id = Number(incBtn.dataset.incCart);
    const cart = cartManager.getCart();
    const item = cart.get(id);
    if (!item) return;
    cartManager.updateQuantity(id, item.quantity + 1);
    updateCartDisplay();
    updateCartPanel();
    return;
  }

  if (decBtn) {
    const id = Number(decBtn.dataset.decCart);
    const cart = cartManager.getCart();
    const item = cart.get(id);
    if (!item) return;
    cartManager.updateQuantity(id, Math.max(1, item.quantity - 1));
    updateCartDisplay();
    updateCartPanel();
    return;
  }
});

// Side panel cart management
cartContent.addEventListener("click", (event) => {
  const removeButton = event.target.closest("button[data-remove-id]");
  const incBtn = event.target.closest("button[data-inc-cart]");
  const decBtn = event.target.closest("button[data-dec-cart]");

  if (removeButton) {
    const id = Number(removeButton.dataset.removeId);
    cartManager.removeItem(id);
    updateCartDisplay();
    updateCartPanel();
    return;
  }

  if (incBtn) {
    const id = Number(incBtn.dataset.incCart);
    const cart = cartManager.getCart();
    const item = cart.get(id);
    if (!item) return;
    cartManager.updateQuantity(id, item.quantity + 1);
    updateCartDisplay();
    updateCartPanel();
    return;
  }

  if (decBtn) {
    const id = Number(decBtn.dataset.decCart);
    const cart = cartManager.getCart();
    const item = cart.get(id);
    if (!item) return;
    cartManager.updateQuantity(id, Math.max(1, item.quantity - 1));
    updateCartDisplay();
    updateCartPanel();
    return;
  }
});

checkoutButton.addEventListener("click", async () => {
  if (cartManager.isEmpty()) {
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

proceedCheckout.addEventListener("click", async () => {
  if (cartManager.isEmpty()) {
    alert("Add products to your cart before checkout.");
    return;
  }
  proceedCheckout.disabled = true;
  proceedCheckout.textContent = "Redirecting...";

  try {
    await createCheckoutSession();
  } catch (error) {
    alert(error.message || "Unable to start checkout.");
    proceedCheckout.disabled = false;
    proceedCheckout.textContent = "Proceed to Checkout";
  }
});

// Initialize
updateCartDisplay();
updateCartPanel();
