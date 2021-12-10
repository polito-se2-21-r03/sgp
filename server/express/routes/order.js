const { models } = require('../../sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Validator } = require("jsonschema");
const OrderRequestSchema = require("../schemas/order-request");
const { DataTypes, Error} = require("sequelize");
const nodemailer = require('nodemailer');
const { pendingCancellation, config, confirmed} = require('../email-service');

const transporter = nodemailer.createTransport(config);

async function getAll(req, res) {
    await models.order.findAll()
        .then(orders => res.status(200).json(orders))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function getById(req, res) {
    await models.order.findByPk(req.params.id)
        .then(async order => {
            const prods = await models.order_product.findAll({ where: { orderId: order.id } })
            const result = {
                id: order.id,
                clientId: order.clientId,
                employeeId: order.employeeId,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                products: await Promise.all(prods.map(async prod => (await models.product.findByPk(prod.productId).then(pr => ({
                    id: pr.id,
                    producerId: pr.producerId,
                    amount: prod.amount,
                    name: pr.name,
                    price: pr.price,
                    type: pr.type,
                    src: pr.src,
                    createdAt: pr.createdAt,
                    updatedAt: pr.updatedAt
                })))))
            }
            return res.status(200).json(result)
        })
        .catch(err => res.status(503).json({ error: err.message }))
}

const rollbackTransaction = async (walletId, total) => await models.wallet.update({ credit: Sequelize.literal('credit + ' + total) }, { where: { userId: req.params.id }})

const rollbackOrder = async (orderId) => await Promise.all([
    await models.order.destroy({where: {id: orderId}}),
    await models.order_product.destroy({where: {orderId: orderId}})
])

async function create(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, OrderRequestSchema.orderRequestSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { employeeId, clientId, products } = req.body
        if (!await models.user.findByPk(clientId) || !await models.user.findByPk(employeeId)) {
            res.status(503).json({ error: `Client or Employee not found` })
        }
        return await models.order.create({
            clientId: clientId,
            employeeId: employeeId,
            status: "CREATED",
            createdAt: Date.now(),
        })
            .then(async order => {
                if (order) {
                    return await Promise.all(products.map(async product => {
                        const count = await models.product.count({
                            where: {
                                id: product.productId,
                                quantity: {[Op.gt]: product.amount}
                            }
                        })
                        if (!count) {
                            throw Error(`Product ${product.productId} not found or unavailable`)
                        }
                        return await models.order_product.create({
                            orderId: order.id,
                            productId: product.productId,
                            amount: product.amount
                        })
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

async function update(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, OrderRequestSchema.orderUpdateSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { clientId, changedBy, status } = req.body
        if (!await models.order.findByPk(req.params.id)) {
            return res.status(503).json({ error: `Order not found` })
        }
        if(status === "CONFIRMED"){
            let products = req.body.products;
            if(!products){
                products = await models.order_product.findAll({where: {orderId: req.params.id},include: [{
                        model: models.product,
                        required: true
                    }]}
                );
            }
            const total = products.reduce((prev, curr) => prev + curr.amount*curr.product.price, 0.0);
            const wallet = await models.wallet.findOne({where: {userId: clientId}})
            const user = await models.user.findByPk(clientId)
            if(wallet.credit < total){
                res.status(503).json({ error: `Credit Unavailable. Order in pending cancellation` })
                await transporter.sendMail(pendingCancellation(user));
                return await models.order.update({ status: "PENDING CANCELLATION" }, { where: { id: req.params.id } })
                    .then(() => res.status(200).json("Order in pending cancellation"))
                    .catch(err => res.status(503).json({ error: err.message }))
            }
            return await models.wallet.update({ credit: Sequelize.literal('credit - ' + total) }, { where: { userId: clientId }})
                .then(async () => {
                    await transporter.sendMail(confirmed(user));
                    return await models.order.update({ status: "CONFIRMED" }, { where: { id: req.params.id } })
                        .then(() => res.status(200).json("Order confirmed and successfully payed"))
                        .catch(err => res.status(503).json({ error: err.message }))
                })
                .catch(err => res.status(503).json({ error: err.message }))
        }

        // switch (changedBy) {
        //     case "EMPLOYEE":
        //         return await models.order.update({ status: status }, { where: { id: req.params.id } })
        //             .then(() => res.status(200).json("Order updated"))
        //             .catch(err => res.status(503).json({ error: err.message }))
        //     case "CLIENT":
        //         return false
        //     default:
        //         return res.status(503).json("Wrong user")
        // }
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    create,
    update,
    getById
};
