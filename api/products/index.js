const { loadProducts, saveProducts, requireAdmin, sendAuthRequired } = require("../_helpers");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const products = await loadProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to load products." });
    }
  }

  if (req.method === "POST") {
    if (!requireAdmin(req)) {
      return sendAuthRequired(res);
    }

    try {
      const products = await loadProducts();
      const { name, description, category, price, image } = req.body;
      if (!name || !description || !category || !price || !image) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1;
      const newProduct = {
        id: nextId,
        name,
        description,
        category,
        price: Number(price),
        image,
      };

      products.push(newProduct);
      await saveProducts(products);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to create product." });
    }
  }

  return res.status(405).json({ error: "Method not allowed." });
};
