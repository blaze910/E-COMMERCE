const { loadProducts, saveProducts, requireAdmin, sendAuthRequired } = require("../_helpers");

module.exports = async (req, res) => {
  const id = Number(req.query?.id);
  if (!id) {
    return res.status(400).json({ error: "Invalid product ID." });
  }

  if (!requireAdmin(req)) {
    return sendAuthRequired(res);
  }

  if (req.method === "PUT") {
    try {
      const products = await loadProducts();
      const productIndex = products.findIndex((item) => item.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found." });
      }

      const { name, description, category, price, image } = req.body;
      if (!name || !description || !category || !price || !image) {
        return res.status(400).json({ error: "All fields are required." });
      }

      products[productIndex] = {
        id,
        name,
        description,
        category,
        price: Number(price),
        image,
      };
      await saveProducts(products);
      return res.status(200).json(products[productIndex]);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to update product." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const products = await loadProducts();
      const remainingProducts = products.filter((item) => item.id !== id);
      if (remainingProducts.length === products.length) {
        return res.status(404).json({ error: "Product not found." });
      }
      await saveProducts(remainingProducts);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to delete product." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
};
