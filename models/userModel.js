const db = require('../config/db');

class User {
  static async findByEmail(email) {
    try {
      console.log('Finding user by email:', email);
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      console.log('Query result:', rows);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async create({ name, email, password, role = 'user' }) {
    try {
      console.log('Creating new user:', { name, email, role });
      
      // First verify the table structure
      const [columns] = await db.query('SHOW COLUMNS FROM users');
      console.log('Table columns:', columns.map(col => col.Field).join(', '));

      // Insert the new user
      const [result] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );
      
      console.log('Insert result:', result);
      
      // Get the created user
      const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      console.log('Created user:', newUser[0]);
      
      return newUser[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log('Finding user by id:', id);
      const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      console.log('Query result:', rows);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      console.log('Updating user:', { id, data });
      const allowedFields = ['name', 'email', 'password', 'role'];
      const updates = Object.keys(data)
        .filter(key => allowedFields.includes(key))
        .map(key => `${key} = ?`);
      
      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      const values = Object.keys(data)
        .filter(key => allowedFields.includes(key))
        .map(key => data[key]);

      const [result] = await db.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        [...values, id]
      );

      console.log('Update result:', result);
      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      return this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

module.exports = User;
