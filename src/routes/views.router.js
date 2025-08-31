import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// 📌 Redirigir "/" a "/home"
router.get("/", (req, res) => {
  res.redirect("/home");
});

// Vista Home
router.get("/home", (req, res) => {
  res.render("home", { title: "Página de inicio" });
});

// Vista realtime
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en tiempo real" });
});

export default router;
