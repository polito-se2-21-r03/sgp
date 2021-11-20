const { models } = require('../../sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {Validator} = require("jsonschema");
const OrderRequestSchema = require("../schemas/order-request");

async function getAll(req, res) {
    await models.order.findAll()
        .then(orders => res.status(200).json(orders))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function create(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, OrderRequestSchema.orderRequestSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { employeeId, clientId, products } = req.body
        if (!await models.client.findByPk(clientId) || !await models.employee.findByPk(employeeId)) {
            res.status(503).json({ error: `Client or Employee not found` })
        }
        await models.order.create({
                clientId: clientId,
                employeeId: employeeId,
                status: "CREATED",
                createdAt: Date.now(),
            })
            .then(async order => {
                if (order) {
                    await Promise.all(products.map(async product => {
                        const count = await models.product.count({where: {id: product.productId, quantity: {[Op.gt]: product.amount}}})
                        if (!count) {
                            res.status(503).json({ error: `Product ${product.productId} not found or not available` })
                        }
                        await models.order_product.create({orderId: order.id, productId: product.productId,amount: product.amount})
                    }))
                        .then(() => res.status(200).json({ orderId: order.id }))
                        .catch(err => res.status(503).json({ error: err.message }))
                }
            })
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    create,
};
