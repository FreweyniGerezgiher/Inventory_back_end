module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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

  Roles.associate = (models) => {
    Roles.hasMany(models.users, { foreignKey: 'role_id', as: 'users' });
  };

  return Roles;
};
