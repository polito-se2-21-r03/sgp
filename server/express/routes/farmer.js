const { models } = require("../../sequelize");
const { Validator } = require("jsonschema");
const OrderRequestSchema = require("../schemas/order-request");
const ProductRequestSchema = require("../schemas/product-request");

async function getAll(req, res) {
  await models.user
    .findAll({ where: { role: "FARMER" } })
    .then((farmers) => res.status(200).json(farmers))
    .catch((err) => res.status(503).json({ error: err.message }));
}

async function getProductsByFarmerId(req, res) {
  await models.product
    .findAll({
      where: { producerId: req.params.id },
    })
    .then((products) => {
      if (products) {
        res.status(200).json(products);
      }
    })
    .catch((err) => res.status(503).json({ error: err.message }));
}

async function getOrderByFarmerId(req, res) {
    await models.order_product
        .findAll({
            where: { userId: req.params.farmerId, orderId: req.params.orderId },
            include: [
                {
                    model: models.product,
                    required: true
                },
                {
                    model: models.order,
                    required: true
                },
            ]
        })
        .then((order_products) => {
            if (order_products) {
                const products = order_products.map(order_product => ({
                    productId: order_product.product.id,
                    name: order_product.product.name,
                    amount: order_product.amount,
                }))
                return res.status(200).json({
                    order: {
                        products: products,
                        clientId: order_products[0].order.clientId,
                        status: order_products[0].order.status,
                    }
                });
            }
        })
        .catch((err) => res.status(503).json({ error: err.message }));
}

async function getOrdersByFarmerId(req, res) {
  await models.order_product
    .findAll({
      where: { userId: req.params.id },
      group: ["orderId", "productId"],
      include: [
        {
          model: models.order,
          required: true,
          where: { status: "CREATED" },
        },
      ],
    })
    .then((orders) => {
      if (orders) {
        const result = orders.reduce((r, order) => {
          r[order.orderId] = r[order.orderId] || {info: {
              createdAt: order.order.createdAt,
              status: order.order.status,
              clientId: order.order.clientId
            }, product: []};
          r[order.orderId]['product'].push({
            productId: order.productId,
            amount: order.amount,
          });
          return r;
        }, Object.create(null));
        res.status(200).json(
          Object.keys(result).map((key, index) => ({
            orderId: key,
            createdAt: result[key]['info'].createdAt,
            status: result[key]['info'].status,
            clientId: result[key]['info'].clientId,
            products: result[key]['product'],
          }))
        );
      }
    })
    .catch((err) => res.status(503).json({ error: err.message }));
}

async function confirmOrderProducts(req, res) {
  const v = new Validator();
  const body = v.validate(
    req.body,
    OrderRequestSchema.confirmOrderProductSchema
  );
  if (!body.valid) {
    return res.status(422).json({ errors: body.errors });
  }
  try {
    const { products } = req.body;
    if (!(await models.order.findByPk(req.params.orderId))) {
      return res.status(503).json({ error: `Order not found` });
    }
    if (products.length > 0) {
      return await Promise.all(
        products.map(async (product) => {
          await models.order_product.update(
            { confirmed: product.confirmed },
            {
              where: {
                userId: req.params.farmerId,
                orderId: req.params.orderId,
                productId: product.productId,
              },
            }
          );
        })
      )
        .then(() =>
          res.status(200).json("Order products successfully reported")
        )
        .catch((err) => res.status(503).json({ error: err.message }));
    } else {
      return res.status(503).json("Error during confirmation order");
    }
  } catch (err) {
    res.status(503).json({ error: err.message });
  }
}

async function createProduct(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, {
        "id": "/FarmerProductRequestSchema",
        "type": "object",
        "properties": {
            "productId": {"type": "integer"},
            "quantity": {"type": "integer"},
        },
        "required": ["quantity", "productId"]
    });
    if(!body.valid){
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { productId, quantity } = req.body
        await models.product_farmer.create({
            productId: productId,
            quantity: quantity,
            userId: req.params.farmerId,
        })
            .then(product => res.status(200).json({ productId: product.productId }))
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

async function updateProduct(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, {
        "id": "/FarmerProductRequestSchema",
        "type": "object",
        "properties": {
            "quantity": {"type": "integer"}
        },
        "required": ["quantity"]
    });
    if(!body.valid){
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { quantity } = req.body
        await models.product_farmer.update({
            quantity: quantity,
        }, {where: {productId: req.params.productId, userId: req.params.farmerId}})
            .then(() => res.status(200).json("Product updated"))
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    getProductsByFarmerId,
    getOrdersByFarmerId,
    confirmOrderProducts,
    createProduct,
    updateProduct,
    getOrderByFarmerId
};
