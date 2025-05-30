module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define(
        'products',
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
                unique: true
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
             reorder_point: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            sku: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            selling_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            minimum_stock_level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            maximum_stock_level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            image_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        },
        {
            freezeTableName: true
        }
    );
};
