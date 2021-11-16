const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user', {
        username: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        firstname: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        lastname: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        role: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isIn: [['ADMIN', 'EMPLOYEE', 'DELIVERYMAN', 'CLIENT']]
            }
        },
        createdAt: {
            allowNull: true,
            type: DataTypes.DATE
        },
    });
};
