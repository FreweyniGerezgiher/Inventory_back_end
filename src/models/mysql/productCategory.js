module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define(
        'product_categories',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
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
            freezeTableName: true, 
        }
    )
}