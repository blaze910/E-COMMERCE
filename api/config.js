const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_your_publishable_key";

module.exports = (req, res) => {
  res.status(200).json({ publishableKey });
};
