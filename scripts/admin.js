const form = document.getElementById("product-form");
const message = document.getElementById("form-message");
const adminGrid = document.getElementById("admin-product-grid");
const searchInput = document.getElementById("admin-search");
const searchGrid = document.getElementById("search-product-grid");
const editModal = document.getElementById("edit-modal-admin");
const editModalClose = document.getElementById("edit-modal-close-admin");
const editForm = document.getElementById("edit-product-form-admin");

let allProducts = [];

function openEditModal(product) {
  editForm.id.value = product.id || "";
  editForm.id.readOnly = true; // Prevent ID edits
  editForm.name.value = product.name || "";
  editForm.brand.value = product.brand || "";
  editForm.image_url.value = product.image_url || "";
  editForm.release_date.value = product.release_date
    ? new Date(product.release_date).toISOString().split("T")[0]
    : "";
  editForm.category.value = product.category || "";
  editForm.sub_category.value = product.sub_category || "";
  editForm.bio_description.value = product.bio_description || "";
  editForm.full_description.value = product.full_description || "";
  editForm.price.value = product.price || 0;
  editForm.shades.value = product.shades ? product.shades.join(", ") : "";
  editForm.finish.value = product.finish || "";
  editForm.coverage.value = product.coverage || "";
  editForm.formula.value = product.formula || "";
  editForm.spf.value = product.spf || "";
  editForm.ingredients.value = product.ingredients ? product.ingredients.join(", ") : "";
  editForm.tags.value = product.tags ? product.tags.join(", ") : "";
  editForm.vegan.checked = product.vegan || false;
  editForm.js_approved.checked = product.js_approved || false;
  editForm.highlighted.checked = product.highlighted || false;

  editModal.classList.remove("hidden");
}

editModalClose.addEventListener("click", () => {
  editModal.classList.add("hidden");
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedProduct = {
    id: editForm.id.value.trim(),
    name: editForm.name.value.trim(),
    brand: editForm.brand.value.trim(),
    image_url: editForm.image_url.value.trim(),
    release_date: editForm.release_date.value,
    category: editForm.category.value.trim(),
    sub_category: editForm.sub_category.value.trim(),
    bio_description: editForm.bio_description.value.trim(),
    full_description: editForm.full_description.value.trim(),
    price: parseFloat(editForm.price.value) || 0,
    currency: "USD", // required
    shades: editForm.shades.value.split(",").map(s => s.trim()).filter(Boolean),
    finish: editForm.finish.value.trim(),
    coverage: editForm.coverage.value.trim(),
    formula: editForm.formula.value.trim(),
    spf: editForm.spf.value ? parseInt(editForm.spf.value) : null,
    ingredients: editForm.ingredients.value.split(",").map(i => i.trim()).filter(Boolean),
    tags: editForm.tags.value.split(",").map(t => t.trim()).filter(Boolean),
    vegan: editForm.vegan.checked,
    js_approved: editForm.js_approved.checked,
    highlighted: editForm.highlighted.checked
  };

  try {
    const res = await fetch(`https://jeffree-api-sky.fly.dev/products/${updatedProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    if (!res.ok) throw new Error("Failed to update product");

    editModal.classList.add("hidden");
    loadAllProducts();
    loadSearchableProducts();
  } catch (err) {
    console.error(err);
    alert("An error occurred while updating the product.");
  }
});

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${product.image_url}" alt="${product.name}" />
    <p><strong>${product.name}</strong></p>
    <p>${product.js_approved ? "✔ JS Approved" : "❌ Not Approved"}</p>
    <p class="quote">${product.bio_description || "No description."}</p>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn" data-id="${product.id}">Delete</button>
  `;

  card.querySelector(".edit-btn").addEventListener("click", () => openEditModal(product));

  card.querySelector(".delete-btn").addEventListener("click", async () => {
    const id = product.id;
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`https://jeffree-api-sky.fly.dev/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadAllProducts();
        loadSearchableProducts();
      } else {
        alert("❌ Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    }
  });

  return card;
}

function renderAdminHighlightedProducts(products) {
  adminGrid.innerHTML = "";
  products.filter(p => p.highlighted).forEach(product => {
    const card = createProductCard(product);
    adminGrid.appendChild(card);
  });
}

function loadAllProducts() {
  fetch("https://jeffree-api-sky.fly.dev/products")
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      renderAdminHighlightedProducts(products);
    })
    .catch(err => {
      console.error(err);
      adminGrid.innerHTML = "<p>Failed to load products.</p>";
    });
}

async function loadSearchableProducts() {
  try {
    const res = await fetch("https://jeffree-api-sky.fly.dev/products");
    const products = await res.json();
    allProducts = products;
  } catch (err) {
    console.error(err);
    searchGrid.innerHTML = "<p>Failed to load searchable products.</p>";
  }
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();
  if (term.length < 2) {
    searchGrid.innerHTML = "";
    return;
  }

  const filtered = allProducts.filter(product => {
    const name = product.name?.toLowerCase() || "";
    const brand = product.brand?.toLowerCase() || "";
    const desc = product.bio_description?.toLowerCase() || "";
    return name.includes(term) || brand.includes(term) || desc.includes(term);
  });

  searchGrid.innerHTML = "";
  filtered.forEach(product => {
    const card = createProductCard(product);
    searchGrid.appendChild(card);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    id: form.id.value.trim(),
    name: form.name.value.trim(),
    brand: form.brand.value.trim(),
    image_url: form.image_url.value.trim(),
    release_date: form.release_date.value,
    category: form.category.value.trim(),
    sub_category: form.sub_category.value.trim(),
    bio_description: form.bio_description.value.trim(),
    full_description: form.full_description.value.trim(),
    price: parseFloat(form.price.value) || 0,
    currency: "USD", // 💡 FIXED
    shades: form.shades.value.split(',').map(s => s.trim()).filter(Boolean),
    finish: form.finish.value.trim(),
    coverage: form.coverage.value.trim(),
    formula: form.formula.value.trim(),
    spf: form.spf.value ? parseInt(form.spf.value) : null,
    ingredients: form.ingredients.value.split(',').map(i => i.trim()).filter(Boolean),
    tags: form.tags.value.split(',').map(t => t.trim()).filter(Boolean),
    vegan: form.vegan.checked,
    js_approved: form.js_approved.checked,
    highlighted: form.highlighted.checked
  };

  try {
    const res = await fetch("https://jeffree-api-sky.fly.dev/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok && res.status !== 201) throw new Error("Failed to submit product");

    try {
      await res.json();
    } catch {}

    message.textContent = "✅ Product submitted successfully!";
    form.reset();
    loadAllProducts();
    loadSearchableProducts();
  } catch (err) {
    console.error(err);
    message.textContent = "❌ Error submitting product. Try again.";
  }
});

loadSearchableProducts().then(loadAllProducts);
