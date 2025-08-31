const socket = io();
const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");

socket.on("updateProducts", (products) => {
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.title} - $${p.price} 
      <button onclick="deleteProduct('${p.id}')">❌</button>`;
    productList.appendChild(li);
  });
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const product = Object.fromEntries(formData.entries());
  socket.emit("addProduct", product);
  productForm.reset();
});

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};
