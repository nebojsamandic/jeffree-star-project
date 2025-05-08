const productList = document.getElementById("product-list");

fetch("https://jeffree-api-sky.fly.dev/products")
  .then((res) => res.json())
  .then((products) => {
    if (products.length === 0) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    productList.innerHTML = ""; // clear "Loading..."
    products.forEach((product) => {
      const item = document.createElement("div");
      item.innerHTML = `
        <h2>${product.name}</h2>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p>${product.description || "No description"}</p>
        <img src="${product.imageUrl}" alt="${product.name}" width="200" />
        <p>${product.approved ? "✅ Approved" : "❌ Not Approved"}</p>
        <hr/>
      `;
      productList.appendChild(item);
    });
  })
  .catch((err) => {
    productList.innerHTML = "<p>Failed to load products.</p>";
    console.error(err);
  });
