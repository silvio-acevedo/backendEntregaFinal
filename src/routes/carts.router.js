import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ status: "error", error: "Error al crear carrito" });
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const productExists = await Product.findById(pid);
    if (!productExists) return res.status(404).send("Producto no encontrado");

    const existing = cart.products.find((p) => p.product.toString() === pid);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).send("Error al agregar producto");
  }
});

// Vaciar carrito
router.post("/:cid/empty", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).send("Error al vaciar carrito");
  }
});

export default router;
