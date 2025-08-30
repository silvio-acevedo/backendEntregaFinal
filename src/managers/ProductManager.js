import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    product.id = Date.now().toString();
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async deleteProduct(id) {
    let products = await this.getProducts();
    products = products.filter((p) => p.id !== id);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }
}

export default ProductManager;
