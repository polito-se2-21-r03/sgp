const { models } = require("../../sequelize");
const { Validator } = require("jsonschema");
const ClientRequestSchema = require("../schemas/client-request");

async function getAll(req, res) {
    await models.user.findAll({ where: { role: 'CLIENT' } })
        .then(clients => res.status(200).json(clients))
        .catch(err => res.status(503).json({ error: err.message }))
}

async function create(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, ClientRequestSchema.clientRequestSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { firstname, lastname, email, password, is_tmp_password } = req.body
        if (await models.user.findOne({ where: { email: email } })) {
            return res.status(503).json({ status: 'customer_exists', error: `Client already present` })
        }
        return await models.user.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            is_tmp_password: is_tmp_password,
            password: password,
            role: "CLIENT",
            createdAt: Date.now(),
        })
            .then(async client => {
                if (client) {
                    return await models.wallet.create({ userEmail: client.email, credit: 0 })
                        .then(() => res.status(200).json({ clientId: client }))
                        .catch(err => res.status(503).json({ error: err.message }))
                }
                return res.status(503).json({ error: "Cannot create the client" })
            })
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        return res.status(503).json({ error: err.message });
    }
}

async function update(req, res) {
    const v = new Validator();
    const body = v.validate(req.body, ClientRequestSchema.clientRequestSchema);
    if (!body.valid) {
        return res.status(422).json({ errors: body.errors })
    }
    try {
        const { firstname, lastname, email, password, is_tmp_password } = req.body
        if (await models.user.findByPk(email)) {
            return res.status(503).json({ error: `Client already present` })
        }
        return await models.user.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            is_tmp_password: is_tmp_password,
            password: password,
            role: "CLIENT",
            createdAt: Date.now(),
        })
            .then(async client => {
                if (client) {
                    return await models.wallet.create({ userEmail: client.email, credit: 0 })
                        .then(() => res.status(200).json({ clientId: client }))
                        .catch(err => res.status(503).json({ error: err.message }))
                }
                return res.status(503).json({ error: "Cannot create the client" })
            })
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        return res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    create,
    update
};