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
            sku: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            cost_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            selling_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
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
