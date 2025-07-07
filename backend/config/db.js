const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connexion MongoDB réussie");
  } catch (err) {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1);
  }
};

module.exports = connectDB;
