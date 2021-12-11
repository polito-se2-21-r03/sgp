function applyExtraSetup(sequelize) {
    const {
        order,
        product,
        order_product,
        wallet,
        user,
        product_farmer
    } = sequelize.models;

    order.belongsToMany(product, {through: order_product});
    product.belongsToMany(order, {through: order_product});
    order_product.belongsTo(product)
    order_product.belongsTo(user)
    order_product.belongsTo(order)
    user.belongsToMany(product, {through: product_farmer});
    product.belongsToMany(user, {through: product_farmer});
    product_farmer.belongsTo(product)
    user.hasOne(wallet)
}

module.exports = { applyExtraSetup };
