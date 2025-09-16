// import { Router } from "express";
// import Product from "../models/Products.js";
// import Cart from "../models/Cart.js";

// const router = Router();

// // Home
// router.get("/", async (req, res) => {
//   // Crear carrito activo si no existe
//   let cart = await Cart.findOne();
//   if (!cart) cart = await Cart.create({ products: [] });

//   res.render("index", { title: "Ecommerce", cartId: cart._id });
// });

// export default router;

import { Router } from "express";
import Product from "../models/Products.js";
import Cart from "../models/Cart.js";

const router = Router();

// Home
router.get("/", (req, res) => {
  res.render("index", { title: "Ecommerce" });
});

// Vista productos con paginación
router.get("/products", async (req, res) => {
  try {
    let { page = 1, limit = 5, sort, query } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (query) {
      if (query === "available") filter.stock = { $gt: 0 };
      else filter.categoria = query;
    }

    const sortOption = {};
    if (sort === "asc") sortOption.precio = 1;
    if (sort === "desc") sortOption.precio = -1;

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const cart = await Cart.findOne(); // obtener carrito único (si no existe, crear)

    res.render("products", {
      title: "Productos",
      products,
      page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      cartId: cart ? cart._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar productos");
  }
});

// Detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    const cart = await Cart.findOne();

    res.render("productDetail", {
      title: "Detalle",
      product,
      cartId: cart ? cart._id : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar detalle de producto");
  }
});

// Carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", { title: "Carrito", cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar carrito");
  }
});

export default router;
