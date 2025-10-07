// server/src/server.js
require('dotenv').config();
const { connectDB } = require('./config/db');
const app = require('./app');


const PORT = process.env.PORT || 4000;


const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

(async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('URI MongoDB manquante (MONGODB_URI/MONGO_URI)');
    }

    await connectDB(MONGO_URI);
    console.log('✅ MongoDB connecté');

    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ API démarrée sur le port ${PORT}`);
    });
  } catch (e) {
    console.error('❌ Démarrage échoué :', e.message);
    process.exit(1);
  }
})();
