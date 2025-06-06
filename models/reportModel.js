const pool = require('../config/db');

const Report = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM reports');
    return rows;
  },
  async create(data) {
    const { title, content, created_by } = data;
    const [result] = await pool.query('INSERT INTO reports (title, content, created_by) VALUES (?, ?, ?)', [title, content, created_by]);
    return { id: result.insertId, ...data };
  },
  async remove(id) {
    await pool.query('DELETE FROM reports WHERE id=?', [id]);
    return { id };
  }
};

module.exports = Report;
