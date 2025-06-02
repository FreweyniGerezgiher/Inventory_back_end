module.exports = (sequelize, DataTypes) => {
  const ProductStocks = sequelize.define('product_stocks', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  ProductStocks.associate = (models) => {
    ProductStocks.belongsTo(models.products, {
      foreignKey: 'product_id',
      as: 'product'
    });

    ProductStocks.belongsTo(models.locations, {
      foreignKey: 'location_id',
      as: 'location'
    });
  };

  return ProductStocks;
};
