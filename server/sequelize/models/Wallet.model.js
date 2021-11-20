const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('wallet', {
        credit: {
            allowNull: false,
            type: Sequelize.DECIMAL(2, 2),
            validate: {
                isDecimal: true
            }
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