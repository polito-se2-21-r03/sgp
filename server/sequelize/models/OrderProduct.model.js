const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order_product', {
        orderId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        amount: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        confirmed: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
