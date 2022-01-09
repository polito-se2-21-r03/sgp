const { models } = require("../../sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Validator } = require("jsonschema");
const OrderRequestSchema = require("../schemas/order-request");
const { DataTypes, Error } = require("sequelize");
const nodemailer = require("nodemailer");
const {
  pendingCancellation,
  config,
  confirmed,
  customEmail,
} = require("../email-service");

const transporter = nodemailer.createTransport(config);

async function getAll(req, res) {
  await models.order
    .findAll()
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(503).json({ error: err.message }));
}

async function getDeliveredOrders(req, res) {
  await models.order
    .findAll({ where: { status: "DELIVERED" } })
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(503).json({ error: err.message }));
}

async function reminder(req, res) {
  return await models.order
    .findByPk(req.params.id)
    .then(async (order) => {
      if (order) {
        const user = await models.user.findByPk(order.clientId);
        if (user) {
          await transporter.sendMail(customEmail(user, req.body.email));
          return res.status(200).json("Message sent");
        }
      }
      return res.status(503).json({ error: "Error sending message" });
    })
    .catch((err) => res.status(503).json({ error: err.message }));
}

async function getByClientId(req, res) {
  const orders = await models.order.findAll({
    where: { clientId: req.params.clientId },
  });
  await Promise.all(
    orders.map(async (order) => {
      const prods = await models.order_product.findAll({
        where: { orderId: order.id },
      });
      const result = {
        id: order.id,
        clientId: order.clientId,
        employeeId: order.employeeId,
        status: order.status,
        type: order.type,
        datetimeDelivery: order.datetime,
        addressDelivery: order.address,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: await Promise.all(
          prods.map(
            async (prod) =>
              await models.product.findByPk(prod.productId).then((pr) => ({
                id: prod.productId,
                farmerId: prod.userId,
                amount: prod.amount,
                confirmed: prod.confirmed,
                status: prod.status,
                name: pr.name,
                price: pr.price,
                type: pr.type,
                src: pr.src,
              }))
          )
        ),
      };
      return res.status(200).json(result);
    })
  ).catch((err) => res.status(503).json({ error: err.message }));
}

async function getById(req, res) {
  await models.order
    .findByPk(req.params.id)
    .then(async (order) => {
      const prods = await models.order_product.findAll({
        where: { orderId: order.id },
      });
      const result = {
        id: order.id,
        clientId: order.clientId,
        employeeId: order.employeeId,
        status: order.status,
        type: order.type,
        datetimeDelivery: order.datetime,
        addressDelivery: order.address,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: await Promise.all(
          prods.map(
            async (prod) =>
              await models.product.findByPk(prod.productId).then((pr) => ({
                id: prod.productId,
                farmerId: prod.userId,
                amount: prod.amount,
                confirmed: prod.confirmed,
                status: prod.status,
                name: pr.name,
                price: pr.price,
                type: pr.type,
                src: pr.src,
                unitOfMeasure: pr.unitOfMeasure,
              }))
          )
        ),
      };
      return res.status(200).json(result);
    })
    .catch((err) => res.status(503).json({ error: err.message }));
}

const rollbackTransaction = async (walletId, total) =>
  await models.wallet.update(
    { credit: Sequelize.literal("credit + " + total) },
    { where: { userId: req.params.id } }
  );

const rollbackOrder = async (orderId) =>
  await Promise.all([
    await models.order.destroy({ where: { id: orderId } }),
    await models.order_product.destroy({ where: { orderId: orderId } }),
  ]);

async function create(req, res) {
  const v = new Validator();
  const body = v.validate(req.body, OrderRequestSchema.orderRequestSchema);
  if (!body.valid) {
    return res.status(422).json({ errors: body.errors });
  }
  try {
    const { employeeId, clientId, products, type, datetime, address } =
      req.body;
    if (
      !(await models.user.findByPk(clientId)) ||
      !(await models.user.findByPk(employeeId))
    ) {
      res.status(503).json({ error: `Client or Employee not found` });
    }
    return await models.order
      .create({
        clientId: clientId,
        employeeId: employeeId,
        status: "CREATED",
        createdAt: Date.now(),
        type: type,
        datetime: datetime,
        address: address,
      })
      .then(async (order) => {
        if (order) {
          return await Promise.all(
            products.map(async (product) => {
              const count = await models.product.count({
                where: {
                  id: product.productId,
                  quantity: { [Op.gte]: product.amount },
                },
              });
              if (!count) {
                throw new Error(
                  `Product ${product.productId} not found or unavailable`
                );
              }
              return await models.order_product.create({
                orderId: order.id,
                productId: product.productId,
                amount: product.amount,
                userId: product.producerId,
              });
            })
          )
            .then(() => res.status(200).json({ orderId: order.id }))
            .catch((err) =>
              res
                .status(404)
                .json({ status: "not_available", error: err.message })
            );
        }
      })
      .catch((err) =>
        res.status(503).json({ status: "failed", error: err.message })
      );
  } catch (err) {
    res.status(503).json({ status: "failed", error: err.message });
  }
}

async function update(req, res) {
  const v = new Validator();
  const body = v.validate(req.body, OrderRequestSchema.orderUpdateSchema);
  if (!body.valid) {
    return res.status(422).json({ errors: body.errors });
  }
  try {
    const { clientId, changedBy, status, products } = req.body;
    if (!(await models.order.findByPk(req.params.id))) {
      return res.status(503).json({ error: `Order not found` });
    }
    if (status === "CONFIRMED" && products) {
      await Promise.all(
        products.map(async (product) => {
          await models.order_product.update(
            { confirmed: product.status },
            { where: { orderId: req.params.id, productId: product.productId } }
          );
        })
      );
    } else {
      return await models.order
        .update({ status: status }, { where: { id: req.params.id } })
        .then(() => res.status(200).json("Order updated"))
        .catch((err) => res.status(503).json({ error: err.message }));
    }
  } catch (err) {
    res.status(503).json({ error: err.message });
  }
}

module.exports = {
  getAll,
  create,
  update,
  getById,
  getByClientId,
  getDeliveredOrders,
  reminder,
};
