import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(
  path.join(__dirname, "../data/products.json")
);

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

router.post("/products", async (req, res) => {
  const { title, price, thumbnail } = req.body;

  if (!title || !price || !thumbnail) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const newProduct = await productManager.addProduct({
      title,
      price,
      thumbnail,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
