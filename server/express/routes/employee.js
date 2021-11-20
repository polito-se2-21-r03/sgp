const { models } = require("../../sequelize");

async function getAll(req, res) {
    await models.employee.findAll({where: {role: 'EMPLOYEE'}})
        .then(employees => res.status(200).json(employees))
        .catch(err => res.status(503).json({ error: err.message }))
}

module.exports = {
    getAll,
};