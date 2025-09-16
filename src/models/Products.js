import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  categoria: { type: String },
  stock: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema, "entregaFinal");
