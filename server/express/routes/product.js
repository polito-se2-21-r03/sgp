const {models} = require("../../sequelize");

async function getAll(req, res) {
    await models.product.findAll()
        .then(products => res.status(200).json(products))
        .catch(err => res.status(503).json({ error: err.message }))
}

module.exports = {
    getAll,
};