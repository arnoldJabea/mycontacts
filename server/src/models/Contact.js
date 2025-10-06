const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 20,
    set: (v) => String(v || '').replace(/\D+/g, '').trim()
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// empêcher les doublons de numéro pour un même utilisateur
contactSchema.index({ owner: 1, phone: 1 }, { unique: true });

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
