'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * In-memory store for JSON documents.
 * Key: string uuid  Value: any JSON-serialisable object
 */
const store = new Map();

/**
 * POST /api/json
 * Accepts any non-empty JSON body and stores it with a generated id.
 */
function create(req, res, next) {
  try {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_BODY',
          message: 'Request body must be a non-empty JSON object',
        },
      });
    }

    if (Object.keys(body).length === 0) {
      return res.status(400).json({
        error: {
          code: 'EMPTY_BODY',
          message: 'Request body must not be empty',
        },
      });
    }

    const id = uuidv4();
    const record = { id, data: body, createdAt: new Date().toISOString() };
    store.set(id, record);

    return res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/json/:id
 * Returns the stored JSON document with the given id.
 */
function getById(req, res, next) {
  try {
    const { id } = req.params;
    const record = store.get(id);

    if (!record) {
      const err = new Error(`No JSON record found with id "${id}"`);
      err.status = 404;
      return next(err);
    }

    return res.status(200).json(record);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/json
 * Returns all stored JSON documents (ids + metadata, no pagination needed for demo).
 */
function getAll(_req, res, next) {
  try {
    const records = Array.from(store.values());
    return res.status(200).json({ count: records.length, records });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, getAll };
