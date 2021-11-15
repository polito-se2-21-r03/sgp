const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('product', {
        producerId: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        quantity: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        price: {
            allowNull: false,
            type: DataTypes.DOUBLE,
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
        }
    });
};
