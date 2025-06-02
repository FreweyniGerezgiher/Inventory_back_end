module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    location_id: {
      type: DataTypes.INTEGER,
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

  Users.associate = (models) => {
    Users.belongsTo(models.roles, { 
      foreignKey: 'role_id', 
      as: 'role' 
    });
    
    Users.belongsTo(models.locations, { 
      foreignKey: 'location_id', 
      as: 'location' 
    });
    
    Users.hasMany(models.purchases, { 
      foreignKey: 'created_by',
      as: 'purchases' 
    });
    
    Users.hasMany(models.sales, { 
      foreignKey: 'created_by',
      as: 'sales' 
    });

    Users.hasMany(models.transfers, {
      foreignKey: 'created_by',
      as: 'created_transfers'
    });
  };

  return Users;
};