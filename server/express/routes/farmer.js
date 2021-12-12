const { models } = require("../../sequelize");
const {Validator} = require("jsonschema");
const OrderRequestSchema = require("../schemas/order-request");

async function getAll(req, res) {
    await models.user.findAll({where: {role: 'FARMER'}})
        .then(farmers => res.status(200).json(farmers))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function getOrdersByFarmerId(req, res) {
    await models.order_product.findAll({
        where: {userId: req.params.id},
        group: ['orderId', 'productId'],
        include: [{
            model: models.order,
            required: true,
            where: {status: "CREATED"}
        }]
    })
        .then(orders => {
            if(orders){
                const result = orders.reduce( (r, order) => {
                    r[order.orderId] = r[order.orderId] || [];
                    r[order.orderId].push({
                        "productId": order.productId,
                        "amount": order.amount
                    });
                    return r;
                }, Object.create(null));
                res.status(200).json(Object.keys(result).map((key, index) => ({
                    "orderId": key,
                    "products": result[key]
                })))
            }
        })
        .catch(err => res.status(503).json({ error: err.message }))
}

async function confirmOrderProducts(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, OrderRequestSchema.confirmOrderProductSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { products } = req.body
        if (!await models.order.findByPk(req.params.orderId)) {
            return res.status(503).json({ error: `Order not found` })
        }
        if(products.length > 0){
            return await Promise.all(products.map(async product => {
                await models.order_product.update({confirmed: product.confirmed}, { where: { userId: req.params.farmerId, orderId: req.params.orderId, productId: product.productId }})
            }))
                .then(() => res.status(200).json("Order products successfully reported"))
                .catch(err => res.status(503).json({ error: err.message }))
        }else{
            return res.status(503).json("Error during confirmation order")
        }
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    getOrdersByFarmerId,
    confirmOrderProducts
};