const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4242;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_your_publishable_key";

const stripe = Stripe(stripeSecretKey || "sk_test_your_secret_key");

const productsFile = path.join(__dirname, "data", "products.json");

const initialProducts = [
  {
    id: 1,
    name: "Executive Branding Kit",
    description: "Complete set of brand assets for premium product launches.",
    category: "branding",
    price: 199,
    image: "images/executive-branding-kit.svg",
  },
  {
    id: 2,
    name: "Conversion-focused UI Toolkit",
    description: "Components and layout patterns proven to boost checkout success.",
    category: "design",
    price: 149,
    image: "images/ui-toolkit.svg",
  },
  {
    id: 3,
    name: "Go-to-market Strategy Session",
    description: "A strategic planning package for commerce growth and audience outreach.",
    category: "strategy",
    price: 299,
    image: "images/strategy-session.svg",
  },
  {
    id: 4,
    name: "Landing Page Optimization",
    description: "Improve product storytelling, trust signals, and buyer confidence.",
    category: "design",
    price: 129,
    image: "images/landing-page-optimization.svg",
  },
  {
    id: 5,
    name: "Premium Product Presentation",
    description: "Visual templates and launch assets for digital product campaigns.",
    category: "branding",
    price: 179,
    image: "images/product-presentation.svg",
  },
  {
    id: 6,
    name: "Customer Journey Audit",
    description: "Actionable insights to reduce friction across browsing and checkout.",
    category: "strategy",
    price: 239,
    image: "images/customer-journey-audit.svg",
  },
];

async function ensureProductsFile() {
  try {
    await fs.access(productsFile);
  } catch (error) {
    await fs.mkdir(path.dirname(productsFile), { recursive: true });
    await fs.writeFile(productsFile, JSON.stringify(initialProducts, null, 2));
  }
}

async function readProducts() {
  await ensureProductsFile();
  const contents = await fs.readFile(productsFile, "utf8");
  return JSON.parse(contents);
}

async function saveProducts(products) {
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
}

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get("/config", (req, res) => {
  res.json({ publishableKey: stripePublicKey });
});

app.get("/admin", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Simple HTTP Basic Authentication for admin routes
function requireAdmin(req, res, next) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) {
    // If not configured, deny access
    return res.status(403).send("Admin credentials not configured on server.");
  }

  const auth = req.headers.authorization;
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid authentication header');
  }

  const credentials = Buffer.from(parts[1], 'base64').toString();
  const sepIndex = credentials.indexOf(':');
  if (sepIndex === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Invalid authentication token');
  }

  const user = credentials.slice(0, sepIndex);
  const pass = credentials.slice(sepIndex + 1);
  if (user === adminUser && pass === adminPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
}

app.get("/api/products", async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load products." });
  }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const products = await readProducts();
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
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create product." });
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const products = await readProducts();
    const id = Number(req.params.id);
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
    res.json(products[productIndex]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update product." });
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const products = await readProducts();
    const id = Number(req.params.id);
    const remainingProducts = products.filter((item) => item.id !== id);
    if (remainingProducts.length === products.length) {
      return res.status(404).json({ error: "Product not found." });
    }
    await saveProducts(remainingProducts);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete product." });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;
    const products = await readProducts();
    const line_items = (items || [])
      .map((item) => {
        const product = products.find((product) => product.id === item.id);
        if (!product) return null;
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${req.protocol}://${req.get("host")}/${product.image}`],
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
      success_url: `${req.protocol}://${req.get("host")}/?success=true`,
      cancel_url: `${req.protocol}://${req.get("host")}/?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`NovaEdge store running on http://localhost:${port}`);
});
