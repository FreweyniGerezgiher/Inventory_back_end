module.exports = (sequelize, DataTypes) => {
  const ProductCategories = sequelize.define('product_categories', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  ProductCategories.associate = (models) => {
    ProductCategories.hasMany(models.products, {
      foreignKey: 'category_id',
      as: 'products'
    });
  };

  return ProductCategories;
};
