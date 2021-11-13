const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Product', {
        productId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
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
            validate: {
                isIn: [['ISSUED', 'CREATED', 'DELIVERED', 'COMPLETED']]
            }
        },
        price: {
            allowNull: false,
            type: DataTypes.DOUBLE,
        },
        creationDate: {
            allowNull: false,
            type: DataTypes.DATE
        }
    });
};
