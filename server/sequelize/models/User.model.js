const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        is_tmp_password: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
        },
        firstname: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        lastname: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        role: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isIn: [['ADMIN', 'EMPLOYEE', 'CLIENT', 'FARMER', 'MANAGER']]
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
