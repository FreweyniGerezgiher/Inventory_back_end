module.exports = (sequelize, DataTypes) => {
  const Locations = sequelize.define('locations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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

  Locations.associate = (models) => {
    Locations.hasMany(models.users, {
      foreignKey: 'location_id',
      as: 'users'
    });

    Locations.hasMany(models.purchases, {
      foreignKey: 'location_id',
      as: 'purchases'
    });

    Locations.hasMany(models.sales, {
      foreignKey: 'location_id',
      as: 'sales'
    });

    Locations.hasMany(models.product_stocks, {
      foreignKey: 'location_id',
      as: 'stock'
    });

    Locations.hasMany(models.transfers, {
      foreignKey: 'from_location_id',
      as: 'outgoing_transfers'
    });

    Locations.hasMany(models.transfers, {
      foreignKey: 'to_location_id',
      as: 'incoming_transfers'
    });
  };

  return Locations;
};