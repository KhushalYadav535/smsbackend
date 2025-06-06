const Accounting = require('../models/accountingModel');

exports.getAll = async (req, res) => {
  try {
    const data = await Accounting.getAll();
    res.json(data);
  } catch (error) {
    console.error('Error fetching accounting data:', error);
    res.status(500).json({ message: 'Error fetching accounting data' });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const entry = await Accounting.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating accounting entry:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(400).json({ 
      message: error.message || 'Error creating accounting entry',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.remove = async (req, res) => {
  try {
    await Accounting.remove(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting accounting entry:', error);
    res.status(500).json({ message: 'Error deleting accounting entry' });
  }
};

exports.getStats = async (req, res) => {
  try {
    console.log('Fetching accounting stats...');
    const stats = await Accounting.getStats();
    console.log('Stats retrieved:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching accounting stats:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ message: 'Error fetching accounting stats' });
  }
};
