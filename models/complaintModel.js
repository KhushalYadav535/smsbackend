const pool = require('../config/db');

const Complaint = {
  async getAll() {
    // Join with users for name/email if needed
    const [rows] = await pool.query('SELECT c.*, u.name as user_name, u.email as user_email FROM complaints c LEFT JOIN users u ON c.user_id = u.id');
    return rows;
  },
  async create(data) {
    const { title, content, user_id } = data;
    const [result] = await pool.query(
      'INSERT INTO complaints (title, content, user_id, status) VALUES (?, ?, ?, ?)',
      [title, content, user_id, 'pending']
    );
    return { id: result.insertId, title, content, user_id, status: 'pending' };
  },
  async updateStatus(id, status) {
    await pool.query('UPDATE complaints SET status=? WHERE id=?', [status, id]);
    return { id, status };
  },
  async remove(id) {
    await pool.query('DELETE FROM complaints WHERE id=?', [id]);
    return { id };
  }
};

module.exports = Complaint;
