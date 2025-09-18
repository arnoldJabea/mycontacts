const mongoose = require('mongoose');

async function connectDB(uri) {
	if (!uri) throw new Error('MONGO_URI manquant');
	await mongoose.connect(uri);
	console.log('MongoDB connecté');
}

module.exports = { connectDB };
