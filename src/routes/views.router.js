import { Router } from "express";
import Product from "../models/Products.js";
import Cart from "../models/Cart.js";

const router = Router();

// Home
router.get("/", async (req, res) => {
  const cart = await Cart.findOne();
  res.render("index", { title: "Ecommerce", cartId: cart ? cart._id : null });
});

// Vista de productos paginados
router.get("/products", async (req, res) => {
  try {
    let { page = 1, limit = 5, query, sort } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 5;

    // filtro por categoría
    const filter = {};
    if (query) {
      if (query === "available") filter.stock = { $gt: 0 };
      else filter.categoria = query;
    }

    // orden por precio
    const sortOption = {};
    if (sort === "asc") sortOption.precio = 1;
    if (sort === "desc") sortOption.precio = -1;

    // totales
    const total = await Product.countDocuments(filter);
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const qs = [];
    if (limit) qs.push(`limit=${limit}`);
    if (sort) qs.push(`sort=${sort}`);
    if (query) qs.push(`query=${encodeURIComponent(query)}`);
    const base = `/products?${qs.join("&")}`;

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const cart = await Cart.findOne();

    res.render("products", {
      title: "Productos",
      products,
      page,
      limit,
      totalPages,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevPage,
      nextPage,
      prevLink: prevPage
        ? `${base}${qs.length ? "&" : ""}page=${prevPage}`
        : null,
      nextLink: nextPage
        ? `${base}${qs.length ? "&" : ""}page=${nextPage}`
        : null,
      cartId: cart ? cart._id.toString() : null,
      query,
      sort,
    });
  } catch (err) {
    console.error("Error en /products:", err);
    res.status(500).send("Error al cargar productos");
  }
});

// Vista de detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    const cart = await Cart.findOne();

    res.render("productDetail", {
      title: "Detalle de producto",
      product,
      cartId: cart ? cart._id.toString() : null,
    });
  } catch (err) {
    console.error("Error en /products/:pid:", err);
    res.status(500).send("Error al cargar detalle");
  }
});

// Carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    let total = 0;
    const items = cart.products.map((p) => {
      const subtotal = p.product.precio * p.quantity;
      total += subtotal;
      return {
        nombre: p.product.nombre,
        precio: p.product.precio,
        quantity: p.quantity,
        subtotal,
      };
    });

    res.render("cart", {
      title: "Carrito",
      cartId: cart._id.toString(),
      items,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar carrito");
  }
});

// Vaciar carrito
router.post("/carts/:cid/empty", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    res.redirect(`/carts/${req.params.cid}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al vaciar carrito");
  }
});

// Comprar carrito
router.post("/carts/:cid/buy", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = [];
    await cart.save();

    res.render("purchase", { cartId: cart._id.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al realizar la compra");
  }
});

export default router;
