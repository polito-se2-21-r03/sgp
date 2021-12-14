const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('product_farmer', {
        productId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
        },
        quantity: {
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
