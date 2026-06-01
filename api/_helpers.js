const fs = require("fs").promises;
const path = require("path");

const dataPath = path.join(process.cwd(), "data", "products.json");
const tmpPath = path.join("/tmp", "products.json");

async function ensureTmpProducts() {
  try {
    await fs.access(tmpPath);
  } catch (error) {
    await fs.mkdir(path.dirname(tmpPath), { recursive: true });
    const source = await fs.readFile(dataPath, "utf8");
    await fs.writeFile(tmpPath, source);
  }
}

async function loadProducts() {
  await ensureTmpProducts();
  const contents = await fs.readFile(tmpPath, "utf8");
  return JSON.parse(contents);
}

async function saveProducts(products) {
  await fs.mkdir(path.dirname(tmpPath), { recursive: true });
  await fs.writeFile(tmpPath, JSON.stringify(products, null, 2));
}

function requireAdmin(req) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (!adminUser || !adminPass) {
    return false;
  }

  const auth = req.headers.authorization;
  if (!auth) {
    return false;
  }

  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Basic") {
    return false;
  }

  const credentials = Buffer.from(parts[1], "base64").toString();
  const separatorIndex = credentials.indexOf(":");
  if (separatorIndex === -1) {
    return false;
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  return username === adminUser && password === adminPass;
}

function sendAuthRequired(res) {
  res.setHeader("WWW-Authenticate", "Basic realm=\"Admin Area\"");
  res.status(401).json({ error: "Authentication required." });
}

module.exports = {
  loadProducts,
  saveProducts,
  requireAdmin,
  sendAuthRequired,
};
