function applyExtraSetup(sequelize) {
    const {
        Order,
        Product,
        OrderProduct,
        User,
        Client,
        Employee
    } = sequelize.models;

    Order.belongsToMany(Product, {through: OrderProduct});
    Product.belongsToMany(Order, {through: OrderProduct});

    User.hasOne(Client)
    User.hasOne(Employee)
}

module.exports = { applyExtraSetup };
