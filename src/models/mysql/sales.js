module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('sales', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference_number: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    document_link:{
      type: DataTypes.STRING(255),
      allowNull: true
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
    underscored: true, 
  });

  Sales.associate = (models) => {
    Sales.hasMany(models.sales_items, { foreignKey: 'sale_id', as: 'items' });
    Sales.belongsTo(models.users, { foreignKey: 'created_by', as: 'user' });
    Sales.belongsTo(models.locations, { foreignKey: 'location_id', as: 'location' });
  };

  return Sales;
};
