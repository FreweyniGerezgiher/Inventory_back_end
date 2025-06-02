module.exports = (sequelize, DataTypes) => {
  const PurchaseItems = sequelize.define('purchase_items', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purchase_id: {
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

  PurchaseItems.associate = (models) => {
    PurchaseItems.belongsTo(models.purchases, { foreignKey: 'purchase_id', as: 'purchase' });
    PurchaseItems.belongsTo(models.products, { foreignKey: 'product_id', as: 'product' });
  };

  return PurchaseItems;
};
