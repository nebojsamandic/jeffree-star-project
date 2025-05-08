const form = document.getElementById("product-form");
const message = document.getElementById("form-message");

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
  } catch (err) {
    console.error(err);
    message.textContent = "❌ Error submitting product. Try again.";
  }
});


const adminGrid = document.getElementById("admin-product-grid");

function loadAllProducts() {
  fetch("https://jeffree-api-sky.fly.dev/products")
    .then(res => res.json())
    .then(products => {
      adminGrid.innerHTML = "";
      products.forEach(product => {
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

      // Attach delete listeners
      adminGrid.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async () => {
          const id = button.getAttribute("data-id");
          if (!confirm("Are you sure you want to delete this product?")) return;

          const res = await fetch(`https://jeffree-api-sky.fly.dev/products/${id}`, {
            method: "DELETE"
          });

          if (res.ok) {
            loadAllProducts(); // Refresh grid
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

// Call it on page load
loadAllProducts();
