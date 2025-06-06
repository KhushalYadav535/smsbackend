const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  let connection;

  try {
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL server');

    // Read SQL file
    const sqlFile = await fs.readFile(path.join(__dirname, 'setup.sql'), 'utf8');
    
    // Split into individual statements
    const statements = sqlFile
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log('Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error executing statement:', error.message);
        console.error('Failed statement:', statement);
        throw error;
      }
    }

    // Verify table structure
    const [columns] = await connection.query('SHOW COLUMNS FROM sms_db.users');
    console.log('Table structure:', columns.map(col => col.Field).join(', '));

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase(); 