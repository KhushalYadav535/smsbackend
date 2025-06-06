const User = require('../models/userModel');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update current user's profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    res.json({ id: userId, name, email });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change current user's password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hash, userId]);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User dashboard stats (for normal users)
exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's dues
    const [[{ myDues = 0 }]] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as myDues FROM accounting WHERE member_id = ? AND status = "Pending"',
      [userId]
    );

    // Get user's complaints count
    const [[{ myComplaints = 0 }]] = await pool.query(
      'SELECT COUNT(*) as myComplaints FROM complaints WHERE user_id = ?',
      [userId]
    );

    // Get unread notices count
    const [[{ unreadNotices = 0 }]] = await pool.query(
      'SELECT COUNT(*) as unreadNotices FROM notices WHERE id NOT IN (SELECT notice_id FROM notice_reads WHERE user_id = ?)',
      [userId]
    );

    // Get recent notices
    const [recentNotices] = await pool.query(`
      SELECT n.id, n.title, n.date, 
      CASE WHEN nr.user_id IS NULL THEN 1 ELSE 0 END as unread 
      FROM notices n 
      LEFT JOIN notice_reads nr ON n.id = nr.notice_id AND nr.user_id = ?
      ORDER BY n.date DESC LIMIT 5
    `, [userId]);

    // Get user's recent complaints
    const [myComplaintsList] = await pool.query(`
      SELECT id, title, status, date 
      FROM complaints 
      WHERE user_id = ? 
      ORDER BY date DESC LIMIT 5
    `, [userId]);

    res.json({
      myDues: Number(myDues),
      myComplaints: Number(myComplaints),
      unreadNotices: Number(unreadNotices),
      recentNotices: recentNotices || [],
      myComplaintsList: myComplaintsList || []
    });
  } catch (error) {
    console.error('Error in getUserDashboardStats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin dashboard stats
exports.getAdminDashboardStats = async (req, res) => {
  try {
    // Get total members
    const [[{ totalMembers = 0 }]] = await pool.query(
      'SELECT COUNT(*) as totalMembers FROM members'
    );

    // Get total dues
    const [[{ totalDues = 0 }]] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as totalDues FROM accounting WHERE status = "Pending"'
    );

    // Get collected dues
    const [[{ collectedDues = 0 }]] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as collectedDues FROM accounting WHERE status = "Paid"'
    );

    // Get pending complaints
    const [[{ pendingComplaints = 0 }]] = await pool.query(
      'SELECT COUNT(*) as pendingComplaints FROM complaints WHERE status = "Pending"'
    );

    // Get total notices
    const [[{ totalNotices = 0 }]] = await pool.query(
      'SELECT COUNT(*) as totalNotices FROM notices'
    );

    // Get recent activities
    const [recentActivities] = await pool.query(`
      SELECT id, 'payment' as type, description, amount, date, 'System' as user 
      FROM accounting 
      ORDER BY date DESC LIMIT 3
    `);

    res.json({
      totalMembers: Number(totalMembers),
      totalDues: Number(totalDues),
      collectedDues: Number(collectedDues),
      pendingComplaints: Number(pendingComplaints),
      totalNotices: Number(totalNotices),
      recentActivities: recentActivities || []
    });
  } catch (error) {
    console.error('Error in getAdminDashboardStats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
