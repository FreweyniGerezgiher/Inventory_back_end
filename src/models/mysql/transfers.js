module.exports = (sequelize, DataTypes) => {
  const Transfers = sequelize.define('transfers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reference_number: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    from_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    to_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transfer_date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  Transfers.associate = (models) => {
    Transfers.hasMany(models.transfer_items, { 
      foreignKey: 'transfer_id', 
      as: 'items' 
    });
    
    Transfers.belongsTo(models.users, { 
      foreignKey: 'created_by', 
      as: 'creator' 
    });
    
    Transfers.belongsTo(models.locations, { 
      foreignKey: 'from_location_id', 
      as: 'from_location' 
    });
    
    Transfers.belongsTo(models.locations, { 
      foreignKey: 'to_location_id', 
      as: 'to_location' 
    });
  };

  return Transfers;
};