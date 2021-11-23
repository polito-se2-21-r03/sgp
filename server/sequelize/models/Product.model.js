const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

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
            type: Sequelize.DECIMAL(10, 2),
            validate: {
                isDecimal: true
            }
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
