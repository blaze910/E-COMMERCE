const fs = require('fs');
const path = require('path');

const categories = ['design', 'branding', 'strategy'];
const adjectives = ['Premium', 'Pro', 'Elite', 'Master', 'Advanced', 'Digital', 'Creative', 'Smart', 'Agile', 'Modern'];
const nouns = ['Kit', 'Bundle', 'Pack', 'Suite', 'Workshop', 'Template', 'Framework', 'Toolkit', 'System', 'Strategy', 'Design', 'Brand', 'Guide', 'Course', 'Session', 'Consultation', 'Package', 'Solution'];
const photos = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
];

const products = [];
for (let i = 1; i <= 100; i++) {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const img = photos[Math.floor(Math.random() * photos.length)];
  const price = Math.round((Math.random() * 250 + 15) * 100) / 100;
  products.push({
    id: i,
    name: `${adj} ${noun} #${i}`,
    description: 'Professional digital solution for modern businesses and creative teams.',
    price: price,
    category: cat,
    image: img
  });
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
console.log(`Generated ${products.length} products and saved to data/products.json`);
