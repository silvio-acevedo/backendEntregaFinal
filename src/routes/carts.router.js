// import { Router } from "express";
// import Cart from "../models/Cart.js";
// import Product from "../models/Products.js";

// const router = Router();

// // Middleware: obtener carrito activo o crear si no existe
// async function getActiveCart(req, res, next) {
//   let cart = await Cart.findOne();
//   if (!cart) {
//     cart = await Cart.create({ products: [] });
//   }
//   req.cart = cart;
//   next();
// }

// // Agregar producto al carrito
// router.post("/:cid/products/:pid", getActiveCart, async (req, res) => {
//   try {
//     const { pid } = req.params;
//     const quantity = parseInt(req.body.quantity) || 1;

//     const product = await Product.findById(pid);
//     if (!product) return res.status(404).send("Producto no encontrado");

//     const cart = req.cart;

//     const index = cart.products.findIndex((p) => p.product.toString() === pid);

//     if (index >= 0) {
//       cart.products[index].quantity += quantity;
//     } else {
//       cart.products.push({ product: pid, quantity });
//     }

//     await cart.save();
//     res.redirect("/carts/" + cart._id);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al agregar producto al carrito");
//   }
// });

// // Ver carrito
// router.get("/:cid", async (req, res) => {
//   try {
//     const cart = await Cart.findById(req.params.cid)
//       .populate("products.product")
//       .lean();
//     if (!cart) return res.status(404).send("Carrito no encontrado");
//     res.render("cart", { title: "Carrito", cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al cargar carrito");
//   }
// });

// // Vaciar carrito
// router.post("/:cid/empty", async (req, res) => {
//   try {
//     const cart = await Cart.findById(req.params.cid);
//     if (!cart) return res.status(404).send("Carrito no encontrado");
//     cart.products = [];
//     await cart.save();
//     res.redirect("/"); // redirige a página principal
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al vaciar carrito");
//   }
// });

// export default router;

import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();

// Crear carrito si no existe
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Error al crear carrito" });
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const existing = cart.products.find((p) => p.product.toString() === pid);
    if (existing) existing.quantity += parseInt(quantity);
    else cart.products.push({ product: pid, quantity: parseInt(quantity) });

    await cart.save();
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).send("Error al vaciar carrito");
  }
});

export default router;
