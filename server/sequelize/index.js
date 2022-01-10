const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./relations');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../server/se2.db',
    logQueryParameters: true,
    benchmark: true
});

const modelDefiners = [
    require('./models/Order.model'),
    require('./models/OrderProduct.model'),
    require('./models/Product.model'),
    require('./models/User.model'),
    require('./models/Wallet.model'),
    require('./models/ProductFarmer.model'),
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;
