const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../../config/db');
const sequelize = new Sequelize(config.dev.database, config.dev.username, config.dev.password, config.dev);
const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

sequelize.addHook('beforeCount', function (options) {
  if (this._scope?.include?.length > 0) {
    options.distinct = true;
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }
  if (options.include?.length > 0) {
    options.include = null;
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
//{ force: true }
sequelize.sync().then(() => {
  // return seedInitialData(db);
});

module.exports = db;

async function seedInitialData(db) {
  try {
    const location = await db.locations.create({
      name: 'Head Office',
      address: '123 Main St',
      is_primary: true,
    });

    const adminRole = await db.roles.create({
      name: 'Admin',
      status: 1,
    });

    const hashedPassword = await bcrypt.hash('admin', 10);

    await db.users.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'admin@admin.com',
      password: hashedPassword,
      status: 1,
      role_id: adminRole.id,
      location_id: location.id,
    });

    await db.roles.bulkCreate([
      { name: 'Purchase Officer', status: 1 },
      { name: 'Sales Officer', status: 1 },
      { name: 'General Manager', status: 1 },
    ]);

    console.log('✅ Seed data inserted: Admin user and Head Office');
  } catch (error) {
    console.error('❌ Error during seed:', error);
  }
}
