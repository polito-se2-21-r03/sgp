function applyExtraSetup(sequelize) {
    const {
        order,
        product,
        order_product,
        user,
        client,
        employee
    } = sequelize.models;

    order.belongsToMany(product, {through: order_product});
    product.belongsToMany(order, {through: order_product});

    user.hasOne(client)
    user.hasOne(employee)
}

module.exports = { applyExtraSetup };
