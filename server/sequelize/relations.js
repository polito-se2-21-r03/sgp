function applyExtraSetup(sequelize) {
    const {
        order,
        product,
        order_product,
        wallet,
        user
    } = sequelize.models;

    order.belongsToMany(product, {through: order_product});
    product.belongsToMany(order, {through: order_product});
    user.hasOne(wallet)
}

module.exports = { applyExtraSetup };
