require('dotenv').config();
const { connectDB } = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('MongoDB Atlas connecté');
    console.log('DEBUG: server.js modifié et relancé');
    app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
