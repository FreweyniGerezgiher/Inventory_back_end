module.exports = (sequelize, DataTypes) => {
  const SalesItems = sequelize.define('sales_items', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  SalesItems.associate = (models) => {
    SalesItems.belongsTo(models.sales, { foreignKey: 'sale_id', as: 'sale' });
    SalesItems.belongsTo(models.products, { foreignKey: 'product_id', as: 'product' });
  };

  return SalesItems;
};
