// DOM refs
const form = document.getElementById("product-form");
const message = document.getElementById("form-message");
const adminGrid = document.getElementById("admin-product-grid");
const searchInput = document.getElementById("admin-search");
const searchGrid = document.getElementById("search-product-grid");

let allProducts = []; // global product cache

// Render search results
function renderSearchResults(products) {
  const term = searchInput.value.toLowerCase().trim();

  if (term === "") {
    searchGrid.innerHTML = "";
    return;
  }

  searchGrid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" />
      <p><strong>${product.name}</strong></p>
      <p>${product.approved ? "✔ Approved" : "❌ Not Approved"}</p>
      <p>${product.recommended ? "🏠 Recommended" : "—"}</p>
      <p class="quote">${product.description || "No description."}</p>
      <button class="delete-btn" data-id="${product.id}">Delete</button>
    `;
    searchGrid.appendChild(card);
  });

  // Delete buttons inside search results
  searchGrid.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("data-id");
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        const res = await fetch(`https://jeffree-api-sky.fly.dev/products/${id}`, {
          method: "DELETE"
        });

        if (res.ok) {
          loadAllProducts();
          loadSearchableProducts();
        } else {
          alert("Failed to delete product.");
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting.");
      }
    });
  });
}

// Load products for search
async function loadSearchableProducts() {
  try {
    const res = await fetch("https://jeffree-api-sky.fly.dev/products");
    const products = await res.json();
    allProducts = products;
  } catch (err) {
    searchGrid.innerHTML = "<p>Failed to load searchable products.</p>";
    console.error(err);
  }
}

// Search input listener
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();

  // Clear on empty or 1-letter terms
  if (term.length < 2) {
    searchGrid.innerHTML = "";
    return;
  }

  const filtered = allProducts.filter(product => {
    const name = product.name?.toLowerCase() || "";
    const brand = product.brand?.toLowerCase() || "";
    const desc = product.description?.toLowerCase() || "";

    // Split fields into words, only match full words or meaningful substrings
    return (
      name.includes(term) ||
      brand.includes(term) ||
      desc.includes(term)
    );
  });

  if (filtered.length > 0) {
    renderSearchResults(filtered);
  } else {
    searchGrid.innerHTML = "<p style='text-align:center; color:#999;'>No results found.</p>";
  }
});




// Load highlighted/recommended products
function loadAllProducts() {
  fetch("https://jeffree-api-sky.fly.dev/products")
    .then(res => res.json())
    .then(products => {
      adminGrid.innerHTML = "";

      products
        .filter(product => product.recommended)
        .forEach(product => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" />
            <p><strong>${product.name}</strong></p>
            <p>${product.approved ? "✔ Approved" : "❌ Not Approved"}</p>
            <p class="quote">${product.description || "No description."}</p>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
          `;
          adminGrid.appendChild(card);
        });

      // Delete buttons inside highlighted products
      adminGrid.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          if (!confirm("Are you sure you want to delete this product?")) return;

          const res = await fetch(`https://jeffree-api-sky.fly.dev/products/${id}`, {
            method: "DELETE"
          });

          if (res.ok) {
            loadAllProducts();
          } else {
            alert("Failed to delete product.");
          }
        });
      });
    })
    .catch(err => {
      adminGrid.innerHTML = "<p>Failed to load products.</p>";
      console.error(err);
    });
}

// Form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    brand: form.brand.value.trim(),
    imageUrl: form.imageUrl.value.trim(),
    description: form.description.value.trim(),
    approved: form.approved.checked,
    recommended: form.recommended.checked,
  };

  try {
    const res = await fetch("https://jeffree-api-sky.fly.dev/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to submit product");

    message.textContent = "✅ Product submitted successfully!";
    form.reset();

    // Refresh both product views
    loadAllProducts();
    loadSearchableProducts();

  } catch (err) {
    console.error(err);
    message.textContent = "❌ Error submitting product. Try again.";
  }
});

// Initial load
loadAllProducts();
loadSearchableProducts();
