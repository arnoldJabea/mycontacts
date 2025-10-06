const express = require('express');
const Contact = require('../models/Contact');
const requireAuth = require('../middlewares/requireAuth');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Contacts
 *     description: Endpoints pour gérer les contacts de l'utilisateur connecté
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         owner:
 *           type: string
 *           description: User id propriétaire du contact
 *         createdAt:
 *           type: string
 *           format: date-time
 *       required: [firstName, lastName, phone]
 *     ContactInput:
 *       type: object
 *       required: [firstName, lastName, phone]
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *     ContactUpdate:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: string
 */

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
    const p = String(phone).replace(/\D+/g, '').trim(); //ça me permet de garder uniquement les chiffres
    if (p.length < 10 || p.length > 20) errors.push('phone doit contenir 10-20 chiffres');
  }
  return errors;
}

function normalizePhone(phone) {
  if (phone == null) return phone;
  return String(phone).replace(/\D+/g, '').trim();
}

// GET /contacts (liste des contacts du user)
/**
 * @openapi
 * /contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Lister les contacts de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Non autorisé
 */
router.get('/', async (req, res) => {
  const owner = req.user.sub;
  const items = await Contact.find({ owner }).sort({ createdAt: -1 });
  res.json(items);
});

// GET /contacts/:id (un contact du user)
/**
 * @openapi
 * /contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     summary: Récupérer un contact par son id (propriété du user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non autorisé
 */
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'id invalide' });
  }
  const owner = req.user.sub;
  const contact = await Contact.findOne({ _id: req.params.id, owner });
  if (!contact) return res.status(404).json({ error: 'Contact introuvable' });
  res.json(contact);
});

// POST /contacts (créer)
/**
 * @openapi
 * /contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Créer un nouveau contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Non autorisé
 */
router.post('/', async (req, res) => {
  const owner = req.user.sub;
  const { firstName, lastName, phone } = req.body || {};
  const errors = validateContactInput({ firstName, lastName, phone });
  if (errors.length) return res.status(400).json({ errors });

  try {
    const doc = await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: normalizePhone(phone),
      owner
    });
    res.status(201).json(doc);
  } catch (err) {
    if (err && err.code === 11000) {
      // duplicate key error from unique index owner+phone
      return res.status(409).json({ error: 'Ce numéro existe déjà pour cet utilisateur' });
    }
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation', details: Object.values(err.errors).map(e => e.message) });
    }
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /contacts/:id (mise à jour partielle)
/**
 * @openapi
 * /contacts/{id}:
 *   patch:
 *     tags: [Contacts]
 *     summary: Mettre à jour partiellement un contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactUpdate'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'id invalide' });
  }
  const owner = req.user.sub;
  const { firstName, lastName, phone } = req.body || {};
  const errors = validateContactInput({ firstName, lastName, phone }, true);
  if (errors.length) return res.status(400).json({ errors });

  const update = {};
  if (firstName != null) update.firstName = String(firstName).trim();
  if (lastName != null) update.lastName = String(lastName).trim();
  if (phone != null) update.phone = normalizePhone(phone);

  try {
    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, owner },
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Contact introuvable' });
    res.json(updated);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Ce numéro existe déjà pour cet utilisateur' });
    }
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation', details: Object.values(err.errors).map(e => e.message) });
    }
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /contacts/:id
/**
 * @openapi
 * /contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Supprimer un contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé (pas de contenu)
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', async (req, res) => {
  const owner = req.user.sub;
  const deleted = await Contact.findOneAndDelete({ _id: req.params.id, owner });
  if (!deleted) return res.status(404).json({ error: 'Contact introuvable' });
  res.status(204).send();
});

module.exports = router;
