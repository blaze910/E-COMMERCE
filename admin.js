const productsTableBody = document.querySelector("#productsTable tbody");
const totalProducts = document.getElementById("totalProducts");
const productForm = document.getElementById("productForm");
const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productDescriptionInput = document.getElementById("productDescription");
const productCategoryInput = document.getElementById("productCategory");
const productPriceInput = document.getElementById("productPrice");
const productImageInput = document.getElementById("productImage");
const saveButton = document.getElementById("saveButton");
const cancelEditButton = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");

let adminProducts = [];

async function fetchAdminProducts() {
  const response = await fetch("/api/products");
  adminProducts = await response.json();
  renderAdminProducts();
}

function renderAdminProducts() {
  productsTableBody.innerHTML = "";
  totalProducts.textContent = `${adminProducts.length} products`;

  for (const product of adminProducts) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>
        <button class="button button-secondary" data-edit-id="${product.id}">Edit</button>
        <button class="button button-secondary" data-delete-id="${product.id}">Delete</button>
      </td>
    `;
    productsTableBody.appendChild(row);
  }
}

function resetForm() {
  productIdInput.value = "";
  productNameInput.value = "";
  productDescriptionInput.value = "";
  productCategoryInput.value = "design";
  productPriceInput.value = "";
  productImageInput.value = "images/";
  formTitle.textContent = "Add new product";
  saveButton.textContent = "Save product";
}

async function submitProduct(event) {
  event.preventDefault();
  const id = Number(productIdInput.value);
  const payload = {
    name: productNameInput.value.trim(),
    description: productDescriptionInput.value.trim(),
    category: productCategoryInput.value,
    price: Number(productPriceInput.value),
    image: productImageInput.value.trim(),
  };

  if (!payload.name || !payload.description || !payload.image || !payload.price) {
    alert("Please fill in all product fields.");
    return;
  }

  if (id) {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } else {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  await fetchAdminProducts();
  resetForm();
}

async function handleTableClick(event) {
  const editButton = event.target.closest("button[data-edit-id]");
  const deleteButton = event.target.closest("button[data-delete-id]");

  if (editButton) {
    const id = Number(editButton.dataset.editId);
    const product = adminProducts.find((item) => item.id === id);
    if (!product) return;

    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productDescriptionInput.value = product.description;
    productCategoryInput.value = product.category;
    productPriceInput.value = product.price;
    productImageInput.value = product.image;
    formTitle.textContent = "Edit product";
    saveButton.textContent = "Update product";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteId);
    if (!confirm("Remove this product from the catalog?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetchAdminProducts();
  }
}

productForm.addEventListener("submit", submitProduct);
cancelEditButton.addEventListener("click", resetForm);
productsTableBody.addEventListener("click", handleTableClick);

fetchAdminProducts();
