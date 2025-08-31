import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3030;

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/static", express.static(path.join(__dirname, "public"))); // js/css cliente

// HANDLEBARS
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ROUTES
app.use("/", viewsRouter);

// SERVIDOR HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

// SOCKET.IO
const io = new Server(httpServer);
const productManager = new ProductManager(
  path.join(__dirname, "data/products.json")
);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  // Enviamos productos al conectar
  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);

  // Agregar producto
  socket.on("addProduct", async (data) => {
    await productManager.addProduct(data); // guarda en JSON
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });

  // Eliminar producto
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    const updatedProducts = await productManager.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});
