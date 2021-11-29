const {models} = require("../../sequelize");
const {Validator} = require("jsonschema");
const ProductRequestSchema = require("../schemas/product-request");

async function getAll(req, res) {
    await models.product.findAll()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function getById(req, res) {
    await models.product.findByPk(req.params.id)
        .then(product => res.status(200).json(product))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function create(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, ProductRequestSchema.productRequestSchema);
    if(!body.valid){
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { producerId, quantity, price, type, name, src } = req.body
        await models.product.create({
            producerId: producerId,
            quantity: quantity,
            price: price,
            src: src,
            name: name,
            type: type,
        })
        .then(product => res.status(200).json({ productId: product.id }))
        .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    create,
    getById
};