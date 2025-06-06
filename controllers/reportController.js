const Report = require('../models/reportModel');

exports.getAll = async (req, res) => {
  const data = await Report.getAll();
  res.json(data);
};

exports.create = async (req, res) => {
  const entry = await Report.create(req.body);
  res.status(201).json(entry);
};

exports.remove = async (req, res) => {
  await Report.remove(req.params.id);
  res.json({ message: 'Deleted' });
};
