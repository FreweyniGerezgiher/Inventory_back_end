module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reorder_point: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    model_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    selling_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Products.associate = (models) => {
    Products.belongsTo(models.product_categories, {
      foreignKey: 'category_id',
      as: 'category'
    });

    Products.hasMany(models.sales_items, {
      foreignKey: 'product_id',
      as: 'sales_items'
    });

    Products.hasMany(models.purchase_items, {
      foreignKey: 'product_id',
      as: 'purchase_items'
    });
  };

  return Products;
};
