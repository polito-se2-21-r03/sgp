const dayjs = require("dayjs");
const Sequelize = require("sequelize");
const { models } = require('../../sequelize');
const nodemailer = require('nodemailer');
const { pendingCancellation, config, confirmed, customEmail} = require('../email-service');

const transporter = nodemailer.createTransport(config);

module.exports = class Routine {

    async routine(virtualTime) {
        let time = dayjs.utc(virtualTime).tz('Europe/Rome');
        let day = time.day();
        let hours = time.hour()

        if (day === 1 && hours === 9) {
            const orders = await models.order.findAll({where: {status: "CREATED"}})
            await Promise.all(orders.map(async order => {
                const products = await models.order_product.findAll({where: {orderId: order.id, confirmed: true},include: [{
                        model: models.product,
                        required: true
                }]});
                if(products.length > 0){
                    const total = products.reduce((prev, curr) => prev + curr.amount*curr.product.price, 0.0);
                    const wallet = await models.wallet.findOne({where: {userId: order.clientId}})
                    const user = await models.user.findByPk(order.clientId)
                    if(wallet.credit < total){
                        await transporter.sendMail(pendingCancellation(user));
                        await models.order.update({ status: "PENDING CANCELLATION" }, { where: { id: order.orderId } })
                    }
                    await models.wallet.update({ credit: Sequelize.literal('credit - ' + total) }, { where: { userId: order.clientId }})
                        .then(async () => {
                            await transporter.sendMail(confirmed(user));
                            await models.order.update({ status: "CONFIRMED" }, { where: { id: order.id } })
                        })
                    // .catch(err => throw Error("Error on Routine" + err.message))
                }
            }))
        }

        // if ((day === 6 && hours < 9) || (day === 0 && hours >= 23) || (day !== 0 && day !== 6)) {
        //     this.event_emptyBaskets();
        // }
    }
}
