'use strict';

const router = require('express').Router();
const { create, getById, getAll } = require('../controllers/form.controller');

/**
 * @swagger
 * /api/form:
 *   post:
 *     summary: Submit a URL-encoded form
 *     description: Accepts application/x-www-form-urlencoded data, assigns a UUID, and stores it in memory.
 *     tags: [Form]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               name: Alice
 *               age: "30"
 *     responses:
 *       201:
 *         description: Form submission stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormRecord'
 *       400:
 *         description: Missing or empty body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     summary: List all stored form submissions
 *     tags: [Form]
 *     responses:
 *       200:
 *         description: Array of all stored records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 records:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FormRecord'
 *
 * /api/form/{id}:
 *   get:
 *     summary: Retrieve a form submission by id
 *     tags: [Form]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the stored submission
 *     responses:
 *       200:
 *         description: The stored form record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormRecord'
 *       404:
 *         description: Submission not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
