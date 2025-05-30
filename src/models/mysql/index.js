var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var config = require('../../config/db');
var sequelize = new Sequelize(config.dev.database, config.dev.username, config.dev.password, config.dev);

async function seedInitialData() {
  try {
    const location = await db.locations.create({
      name: 'Head Office',
      address: '123 Main St',
      is_primary: true
    });

    const role = await db.roles.create({
      name: 'Admin',
      status: 1
    })
    const hashedPassword = await bcrypt.hash('admin', 10);

    await db.users.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@admin.com',
      password: hashedPassword,
      status: 1,
      role_id: role.id,
      location_id: location.id
    });

    console.log('Seed data inserted: Admin user and Head Office');
  } catch (error) {
    console.error('Error during seed:', error);
  }
}

// Sync and conditionally seed
sequelize.sync(
  // {alter: true},

  // { force: true }).then(async () => {await seedInitialData()}

);

var db = {};

fs.readdirSync(__dirname)
    .filter(function (file) {
        return file.indexOf('.') !== 0 && file != basename;
    })
    .forEach(function (file) {
        if (file.slice(-3) !== '.js') return;
        var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

db.roles.hasMany(db.users, { foreignKey: 'role_id' });
db.users.belongsTo(db.roles, { foreignKey: 'role_id', as: 'role' });

// Users and Locations
db.locations.hasMany(db.users, { foreignKey: 'location_id' });
db.users.belongsTo(db.locations, { foreignKey: 'location_id', as: 'location' });

// Product Categories and Products
db.product_categories.hasMany(db.products, { foreignKey: 'category_id', as: 'products' });
db.products.belongsTo(db.product_categories, { foreignKey: 'category_id', as: 'category' });

// Products and Stock
db.products.hasMany(db.product_stocks, { foreignKey: 'product_id', as: 'stock' });
db.product_stocks.belongsTo(db.products, { foreignKey: 'product_id', as: 'product' });

// Locations and Stock
db.locations.hasMany(db.product_stocks, { foreignKey: 'location_id', as: 'stock' });
db.product_stocks.belongsTo(db.locations, { foreignKey: 'location_id', as: 'location' });

// Purchases and Purchase Items
db.purchases.hasMany(db.purchase_items, { foreignKey: 'purchase_id', as: 'items' });
db.purchase_items.belongsTo(db.purchases, { foreignKey: 'purchase_id', as: 'purchase' });

// Purchase Items and Products
db.products.hasMany(db.purchase_items, { foreignKey: 'product_id', as: 'purchase_items' });
db.purchase_items.belongsTo(db.products, { foreignKey: 'product_id', as: 'product' });

// Purchases and Users
db.users.hasMany(db.purchases, { foreignKey: 'user_id', as: 'purchases' });
db.purchases.belongsTo(db.users, { foreignKey: 'user_id', as: 'user' });

db.suppliers.hasMany(db.purchases, { foreignKey: 'supplier_id', as: 'purchases' });
db.purchases.belongsTo(db.suppliers, { foreignKey: 'supplier_id', as: 'supplier' });

// Purchases and Locations
db.locations.hasMany(db.purchases, { foreignKey: 'location_id', as: 'purchases' });
db.purchases.belongsTo(db.locations, { foreignKey: 'location_id', as: 'location' });

// Sales and Sales Items
db.sales.hasMany(db.sales_items, { foreignKey: 'sale_id', as: 'items' });
db.sales_items.belongsTo(db.sales, { foreignKey: 'sale_id', as: 'sale' });

// Sales Items and Products
db.products.hasMany(db.sales_items, { foreignKey: 'product_id', as: 'sales_items' });
db.sales_items.belongsTo(db.products, { foreignKey: 'product_id', as: 'product' });

// Sales and Users
db.users.hasMany(db.sales, { foreignKey: 'user_id', as: 'sales' });
db.sales.belongsTo(db.users, { foreignKey: 'user_id', as: 'user' });

// Sales and Locations
db.locations.hasMany(db.sales, { foreignKey: 'location_id', as: 'sales' });
db.sales.belongsTo(db.locations, { foreignKey: 'location_id', as: 'location' });


Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

//Fix the wrong count issue in findAndCountAll()
sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
  }

  if (options.include && options.include.length > 0) {
    options.include = null
  }
})
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;