const fs = require("fs").promises;
const path = require("path");
const Stripe = require("stripe");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_your_secret_key";
const stripe = Stripe(stripeSecretKey);

async function loadProducts() {
  const productsFile = path.join(process.cwd(), "data", "products.json");
  const contents = await fs.readFile(productsFile, "utf8");
  return JSON.parse(contents);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const items = payload?.items;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No valid items in cart." });
  }

  try {
    const products = await loadProducts();
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const line_items = items
      .map((item) => {
        const product = products.find((product) => product.id === item.id);
        if (!product) return null;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${baseUrl}/${product.image}`],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    if (line_items.length === 0) {
      return res.status(400).json({ error: "No valid items in cart." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/?success=true`,
      cancel_url: `${baseUrl}/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Unable to create checkout session." });
  }
};
