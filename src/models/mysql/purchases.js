module.exports = (sequelize, DataTypes) => {
  const Purchases = sequelize.define('purchases', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    purchase_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
   reference_number: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    document_link:{
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'pending',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
    }
  }, {
    freezeTableName: true,
    timestamps: false, 
    underscored: true 
  });

  Purchases.associate = (models) => {
    Purchases.belongsTo(models.users, { foreignKey: 'created_by', as: 'user' });
    Purchases.belongsTo(models.suppliers, { foreignKey: 'supplier_id', as: 'supplier' });
    Purchases.belongsTo(models.locations, { foreignKey: 'location_id', as: 'location' });
    Purchases.hasMany(models.purchase_items, { foreignKey: 'purchase_id', as: 'items' });
  };

  return Purchases;
};
