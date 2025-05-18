module.exports = (Sequelize, DataTypes) =>{
    return Sequelize.define(
        'roles',
        {
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