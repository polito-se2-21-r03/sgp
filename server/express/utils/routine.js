import dayjs from "dayjs";
import {confirmed, pendingCancellation} from "../email-service";
import Sequelize from "sequelize";
const { models } = require('../../sequelize');
const nodemailer = require('nodemailer');
const { pendingCancellation, config, confirmed, customEmail} = require('../email-service');

const transporter = nodemailer.createTransport(config);

export default class Routine {

    async routine(virtualTime) {
        let time = dayjs.utc(virtualTime).tz('Europe/Rome');
        let day = time.day();
        let hours = time.hour()

        if (day === 1 && hours === 9) {
            const orders = await models.order.findAll({where: {status: "CREATED"}})
            await Promise.all(orders.map(async order => {
                const products = await models.order_product.findAll({where: {orderId: order.orderId, confirmed: true},include: [{
                        model: models.product,
                        required: true
                }]});
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
                        await models.order.update({ status: "CONFIRMED" }, { where: { id: order.orderId } })
                    })
                    .catch(err => throw Error("Error on Routine" + err.message))
            }))
        }

        /**
         * Check whether the current day and time is within
         * the time interval in which clients can make orders
         * (i.e. from Sat. 9am to Sun. 11pm).
         *
         * If the current time is outside this interval, all client
         * baskets are emptied.
         */
        if ((day === 6 && hours < 9) || (day === 0 && hours >= 23) || (day !== 0 && day !== 6)) {
            this.event_emptyBaskets();
        }
    }

    /**
     * Updates order statuses on Monday at 9am.
     * All "pending" orders are either set to "confirmed"
     * or "pending_canc" (i.e. pending cancellation due to
     * insufficient funds).
     * This triggers the delivery of the reminders for insufficient balance.
     */
    event_updateOrders() {
        checksClientBalance()
            .then((mailList) => {
                this.event_sendBalanceReminders(mailList);
            })
            .catch((err) => {
                console.log("Error: could not update order status: " + err);
            });
    }

    /**
     * Deletes all tuples from the "Basket" table in the DB.
     * This operation is executed whenever the current time is
     * outside the time interval in which clients are allowed to
     * make orders.
     */
    event_emptyBaskets() {
        emptyBaskets()
            .then(() => {})
            .catch((err) => {
                console.log("Error: there was an error in emptying baskets: " + err);
            });
    }

    /**
     * Sends reminders via e-mail to all clients who have
     * orders pending cancellation due to insufficient funds.
     *
     * @param {array of objects} mailingList Array of objects, each containing the
     *      email of the user and the id of the order for which they do not have
     *      enough balance for. There can be multiple objects referring to the
     *      same user (i.e. with the same email).
     */
    event_sendBalanceReminders(mailingList) {
        for (let mail of mailingList) {
            mail_sendBalanceReminder(mail.email, mail.id)
                .then((res) => {
                    // ok
                })
                .catch((err) => console.log(err));
        }
    }
}
