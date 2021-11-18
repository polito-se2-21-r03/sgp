const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('employee', {
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        type: {
            allowNull: false,
            type: DataTypes.STRING
        },
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
    });
};
