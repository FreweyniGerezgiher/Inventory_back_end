module.exports = (sequelize, DataTypes) => {
  const TransferItems = sequelize.define('transfer_items', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transfer_id: {
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
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  });

  TransferItems.associate = (models) => {
    TransferItems.belongsTo(models.transfers, {
      foreignKey: 'transfer_id',
      as: 'transfer'
    });
    
    TransferItems.belongsTo(models.products, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return TransferItems;
};