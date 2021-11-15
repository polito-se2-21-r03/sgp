const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('order_product', {
        orderId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            references: {
                model: 'order',
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            references: {
                model: 'product',
                key: 'id'
            }
        },
        amount: {
            allowNull: false,
            type: DataTypes.INTEGER,
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
