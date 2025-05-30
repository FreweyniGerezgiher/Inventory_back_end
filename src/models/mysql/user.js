module.exports = (Sequelize, DataTypes) =>{
    return Sequelize.define(
        'users',
        {
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
                unique: true,
                
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(50),
                allowNull: false
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
}