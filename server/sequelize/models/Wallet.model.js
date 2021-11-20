const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('wallet', {
        credit: {
            allowNull: false,
            type: DataTypes.FLOAT,
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