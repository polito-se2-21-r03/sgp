module.exports = (sequelize) => {
    sequelize.define('OrderProduct', {
        amount: {
            allowNull: false,
            type: DataTypes.INTEGER,
        }
    });
};
