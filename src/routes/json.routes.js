'use strict';

const router = require('express').Router();
const { create, getById, getAll } = require('../controllers/json.controller');

/**
 * @swagger
 * /api/json:
 *   post:
 *     summary: Store a JSON document
 *     description: Accepts any non-empty JSON object, assigns a UUID, and stores it in memory.
 *     tags: [JSON]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *             example:
 *               name: Alice
 *               age: 30
 *     responses:
 *       201:
 *         description: Document stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonRecord'
 *       400:
 *         description: Missing or empty body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     summary: List all stored JSON documents
 *     tags: [JSON]
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
 *                     $ref: '#/components/schemas/JsonRecord'
 *
 * /api/json/{id}:
 *   get:
 *     summary: Retrieve a JSON document by id
 *     tags: [JSON]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the stored document
 *     responses:
 *       200:
 *         description: The stored JSON record
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonRecord'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
