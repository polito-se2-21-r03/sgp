const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Order', {
        orderId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
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
            validate: {
                isIn: [['ISSUED', 'CREATED', 'DELIVERED', 'COMPLETED']]
            }
        },
        creationDate: {
            allowNull: false,
            type: DataTypes.DATE
        }
    });
};
