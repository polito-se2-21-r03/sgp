const { models } = require("../../sequelize");

async function getAll(req, res) {
    await models.user.findAll({where: {role: 'FARMER'}})
        .then(farmers => res.status(200).json(farmers))
        .catch(err => res.status(503).json({ error: err.message }))
}

module.exports = {
    getAll,
};