const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./relations');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'server/se2.db',
    logQueryParameters: true,
    benchmark: true
});

const modelDefiners = [
    require('./models/Client.model'),
    require('./models/Employee.model'),
    require('./models/Order.model'),
    require('./models/OrderProduct.model'),
    require('./models/Product.model'),
    require('./models/User.model'),
    require('./models/Wallet.model'),
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;
