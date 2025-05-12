module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('sales', {
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
            defaultValue: Sequelize.fn('NOW'),
        },
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });
};
