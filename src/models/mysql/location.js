module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define(
        'locations',
        {
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
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        },
        {
            freezeTableName: true
        }
    );
};
