module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('suppliers', {
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
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
            unique: true
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        alternate_phone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },

         bank_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        account_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('NOW')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('NOW')
        }
    }, {
        freezeTableName: true
    });
};