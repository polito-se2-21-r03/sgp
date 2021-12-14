const { models } = require("../../sequelize");
const Sequelize = require("../../sequelize");
const nodemailer = require('nodemailer');
const {Validator} = require("jsonschema");
const UpdateWalletSchema = require("../schemas/wallet-request");
const { pendingCancellation, config, confirmed } = require('../email-service');

const transporter = nodemailer.createTransport(config);

async function getAll(req, res) {
    await models.wallet.findAll()
        .then(wallets => res.status(200).json(wallets))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function getById(req, res) {
    await models.wallet.findOne({where: {userId: req.params.id}})
        .then(wallet => res.status(200).json(wallet))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function update(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, UpdateWalletSchema.updateWalletSchema);
    if(!body.valid){
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { credit } = req.body
        if (!await models.wallet.findOne({where: {userId: req.params.id}})) {
            return res.status(503).json({ error: `Invalid client` })
        }
        return await models.wallet.update({ credit: Sequelize.literal('credit + ' + credit) }, { where: { userId: req.params.id }})
            .then(async () => {
                await models.order.findAll({where: {clientId: req.params.id, status: "PENDING CANCELATION"}})
                    .then(async orders => {
                        if(orders.length <= 0){
                            return res.status(200).json("Wallet Updated");
                        }
                        return await Promise.all(orders.map(async order => {
                            return await models.order_product.findAll({
                                where: {orderId: order.id},
                                group: ["orderId", "productId"],
                                include: [
                                    {
                                        model: models.product,
                                        required: true,
                                    },
                                ],
                            })
                                .then(async order_product => {
                                    const products = order_product.reduce((r, o) => {
                                        r[o.orderId] = r[o.orderId] || []
                                        r[o.orderId].push({
                                            productId: o.productId,
                                            amount: o.amount,
                                            price: o.product.price,
                                            orderId: o.orderId
                                        });
                                        return r;
                                    }, []);
                                    return await Promise.all(products.map(async product => {
                                        const total = product.reduce(
                                            (prev, curr) => prev + curr.amount*curr.price, 0.0
                                        );
                                        const wallet = await models.wallet.findOne({where: {userId: req.params.id}})
                                        const user = await models.user.findByPk(req.params.id)
                                        if(wallet.credit > total){
                                            return await models.wallet.update({ credit: Sequelize.literal('credit - ' + total) }, { where: { userId: req.params.id }})
                                                .then(async () => {
                                                    await transporter.sendMail(confirmed(user));
                                                    await models.order.update({ status: "CONFIRMED" }, { where: { clientId: req.params.id, status: "PENDING CANCELATION" } })
                                                    return res.status(200).json("Wallet Updated and pending orders were successfully confirmed");
                                                })
                                        }
                                    }))
                                })
                        }))
                    })
                return res.status(200).json("Wallet Updated");
            })
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        return res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getById,
    getAll,
    update,
};