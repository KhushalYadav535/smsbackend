const pool = require('../config/db');
const User = require('./userModel');
const bcrypt = require('bcrypt');

const Member = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT m.*, u.name, u.email, u.role 
      FROM members m 
      JOIN users u ON m.user_id = u.id
      ORDER BY m.id DESC
    `);
    return rows;
  },
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [id]);
    return rows[0];
  },
  async create(data) {
    const { name, email, password, house_number, phone_number } = data;
    
    // First create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    // Then create the member with the user's ID
    const [result] = await pool.query(
      'INSERT INTO members (user_id, house_number, phone_number) VALUES (?, ?, ?)',
      [user.id, house_number, phone_number]
    );

    // Get the created member with user details
    const [member] = await pool.query(`
      SELECT m.*, u.name, u.email 
      FROM members m 
      JOIN users u ON m.user_id = u.id 
      WHERE m.id = ?
    `, [result.insertId]);

    return member[0];
  },
  async update(id, data) {
    const { user_id, house_number, phone_number } = data;
    await pool.query('UPDATE members SET user_id=?, house_number=?, phone_number=? WHERE id=?', [user_id, house_number, phone_number, id]);
    return { id, user_id, house_number, phone_number };
  },
  async remove(id) {
    await pool.query('DELETE FROM members WHERE id=?', [id]);
    return { id };
  }
};

module.exports = Member;
