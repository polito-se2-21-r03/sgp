const { models } = require("../../sequelize");
const {Validator} = require("jsonschema");
const ClientRequestSchema = require("../schemas/client-request");

async function getAll(req, res) {
    await models.client.findAll()
        .then(clients => res.status(200).json(clients))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function create(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, ClientRequestSchema.clientRequestSchema);
    if(!body.valid){
        return res.status(422).json({ errors: body.errors })
    }
    try {
        // const { walletId, userId, products } = req.body
        // if (!await models.client.findByPk(clientId) || !await models.employee.findByPk(employeeId)) {
        //     res.status(503).json({ error: `Client or Employee not found` })
        // }
        // await models.order.create({
        //     clientId: clientId,
        //     employeeId: employeeId,
        //     status: "CREATED",
        //     createdAt: Date.now(),
        // })
        // .then(async client => {
        //     if (client) {
        //         await Promise.all(products.map(async product => {
        //             const count = await models.product.count({where: {id: product.productId, quantity: {[Op.gt]: product.amount}}})
        //             if (!count) {
        //                 res.status(503).json({ error: `Product ${product.productId} not found or not available` })
        //             }
        //             await models.order_product.create({orderId: orderId.id, productId: product.productId,amount: product.amount})
        //         }))
        //             .then(() => res.status(200).json({ orderId: orderId }))
        //             .catch(err => res.status(503).json({ error: err.message }))
        //     }
        // })
        // .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    create
};