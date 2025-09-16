// import express from "express";
// import { engine } from "express-handlebars";
// import path from "path";
// import { fileURLToPath } from "url";

// import connectDB from "./config/db.js";

// import viewsRouter from "./routes/views.router.js";
// import productRouter from "./routes/products.router.js";
// import cartsRouter from "./routes/carts.router.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = 3030;

// connectDB();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use("/static", express.static(path.join(__dirname, "public")));

// // Handlebars
// app.engine("handlebars", engine());
// app.set("view engine", "handlebars");
// app.set("views", path.join(__dirname, "views"));

// // Routers
// app.use("/", viewsRouter);
// app.use("/products", productRouter);
// app.use("/carts", cartsRouter);

// // Servidor
// app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3030;

// Conectar MongoDB
connectDB();

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/static", express.static(path.join(__dirname, "public")));

// HANDLEBARS
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ROUTES
app.use("/", viewsRouter); // Vistas
app.use("/api/products", productRouter); // API Productos
app.use("/carts", cartsRouter); // Carrito

// SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
