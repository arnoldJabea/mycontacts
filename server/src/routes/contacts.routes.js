const express = require('express');
const Contact = require('../models/Contact');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

// Applique l'authentification à toutes les routes contacts
router.use(requireAuth);

// Helpers validation
function validateContactInput({ firstName, lastName, phone }, partial = false) {
  const errors = [];
  const has = (v) => typeof v === 'string' && v.trim().length > 0;
  if (!partial) {
    if (!has(firstName)) errors.push('firstName requis');
    if (!has(lastName)) errors.push('lastName requis');
    if (!has(phone)) errors.push('phone requis');
  }
  if (phone != null) {
    const p = String(phone).trim();
    if (p.length < 10 || p.length > 20) errors.push('phone doit faire 10-20 caractères');
  }
  return errors;
}

// GET /contacts (liste des contacts du user)
router.get('/', async (req, res) => {
  const owner = req.user.sub;
  const items = await Contact.find({ owner }).sort({ createdAt: -1 });
  res.json(items);
});

// GET /contacts/:id (un contact du user)
router.get('/:id', async (req, res) => {
  const owner = req.user.sub;
  const contact = await Contact.findOne({ _id: req.params.id, owner });
  if (!contact) return res.status(404).json({ error: 'Contact introuvable' });
  res.json(contact);
});

// POST /contacts (créer)
router.post('/', async (req, res) => {
  const owner = req.user.sub;
  const { firstName, lastName, phone } = req.body || {};
  const errors = validateContactInput({ firstName, lastName, phone });
  if (errors.length) return res.status(400).json({ errors });

  const doc = await Contact.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: String(phone).trim(),
    owner
  });
  res.status(201).json(doc);
});

// PATCH /contacts/:id (mise à jour partielle)
router.patch('/:id', async (req, res) => {
  const owner = req.user.sub;
  const { firstName, lastName, phone } = req.body || {};
  const errors = validateContactInput({ firstName, lastName, phone }, true);
  if (errors.length) return res.status(400).json({ errors });

  const update = {};
  if (firstName != null) update.firstName = String(firstName).trim();
  if (lastName != null) update.lastName = String(lastName).trim();
  if (phone != null) update.phone = String(phone).trim();

  const updated = await Contact.findOneAndUpdate(
    { _id: req.params.id, owner },
    { $set: update },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Contact introuvable' });
  res.json(updated);
});

// DELETE /contacts/:id
router.delete('/:id', async (req, res) => {
  const owner = req.user.sub;
  const deleted = await Contact.findOneAndDelete({ _id: req.params.id, owner });
  if (!deleted) return res.status(404).json({ error: 'Contact introuvable' });
  res.status(204).send();
});

module.exports = router;
