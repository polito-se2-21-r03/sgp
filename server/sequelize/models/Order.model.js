const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order', {
        clientId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        employeeId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        status: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: true,
            type: DataTypes.DATE
        }
    });
};
