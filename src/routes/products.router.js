// import { Router } from "express";
// import Product from "../models/Products.js";

// const router = Router();

// // GET /api/products?limit=&page=&sort=&query=
// router.get("/", async (req, res) => {
//   try {
//     let { limit = 5, page = 1, sort, query } = req.query;
//     limit = parseInt(limit);
//     page = parseInt(page);

//     const filter = {};
//     if (query) {
//       if (query === "available") filter.stock = { $gt: 0 };
//       else filter.categoria = query;
//     }

//     const sortOption = {};
//     if (sort === "asc") sortOption.precio = 1;
//     if (sort === "desc") sortOption.precio = -1;

//     const total = await Product.countDocuments(filter);
//     const totalPages = Math.ceil(total / limit);

//     const products = await Product.find(filter)
//       .sort(sortOption)
//       .limit(limit)
//       .skip((page - 1) * limit)
//       .lean();

//     const queryString = [];
//     if (limit) queryString.push(`limit=${limit}`);
//     if (sort) queryString.push(`sort=${sort}`);
//     if (query) queryString.push(`query=${query}`);
//     const baseLink = `/products?${queryString.join("&")}`;

//     res.render("products", {
//       title: "Productos",
//       products,
//       page,
//       totalPages,
//       prevLink: page > 1 ? `${baseLink}&page=${page - 1}` : null,
//       nextLink: page < totalPages ? `${baseLink}&page=${page + 1}` : null,
//       cartId: "activo", // carrito fijo
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al cargar productos");
//   }
// });

// export default router;

import { Router } from "express";
import Product from "../models/Products.js";

const router = Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

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

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", error: "Error al obtener productos" });
  }
});

export default router;
