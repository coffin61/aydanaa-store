// lib/audit.js
import db from './db.js';

export async function logAudit({ userId, entity, entityId, action, changes }) {
  try {
    await db.query(
      'INSERT INTO audits (user_id, entity, entity_id, action, changes) VALUES (?, ?, ?, ?, ?)',
      [userId || null, entity, entityId, action, JSON.stringify(changes || {})]
    );
  } catch (e) {
    // Fail-safe: don’t crash the request on audit error
    console.error('Audit log error:', e.message);
  }
}