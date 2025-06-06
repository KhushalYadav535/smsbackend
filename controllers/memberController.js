const Member = require('../models/memberModel');

exports.getAll = async (req, res) => {
  const members = await Member.getAll();
  res.json(members);
};

exports.getById = async (req, res) => {
  const member = await Member.getById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Not found' });
  res.json(member);
};

exports.create = async (req, res) => {
  const member = await Member.create(req.body);
  res.status(201).json(member);
};

exports.update = async (req, res) => {
  const member = await Member.update(req.params.id, req.body);
  res.json(member);
};

exports.remove = async (req, res) => {
  await Member.remove(req.params.id);
  res.json({ message: 'Deleted' });
};
