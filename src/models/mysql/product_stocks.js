module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define(
        'product_stocks',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            location_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            quantity_in_stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            reorder_level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
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
