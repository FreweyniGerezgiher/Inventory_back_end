const models = require('../models/mysql');
const Roles = models.roles;
const { err, success } = require('../utils/responses');

module.exports = {

   getAllRoles: async (req, res) => {
  try {
    const users = await Roles.findAll({
    });
    return res.status(200).json(success(users, 'Roles fetched successfully'));
  } catch (e) {
    return res.status(500).json(err('Server error', e.message));
  }
}
};
