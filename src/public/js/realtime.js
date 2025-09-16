// Cliente Socket.IO para actualizar productos en tiempo real
const socket = io();

socket.on("updateProducts", (products) => {
  const list = document.getElementById("products-list");
  list.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - $${p.price}`;
    list.appendChild(li);
  });
});
