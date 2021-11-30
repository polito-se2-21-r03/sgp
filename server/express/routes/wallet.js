const { models } = require("../../sequelize");
const Sequelize = require("../../sequelize");
const {Validator} = require("jsonschema");
const UpdateWalletSchema = require("../schemas/wallet-request");

async function getAll(req, res) {
    await models.wallet.findAll()
        .then(wallets => res.status(200).json(wallets))
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
        return await models.wallet.update({ credit: Sequelize.literal('credit + ' + Math.round((credit + Number.EPSILON) * 100) / 100) }, { where: { userId: req.params.id }})
            .then(() => res.status(200).json("Wallet Updated"))
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (err) {
        return res.status(503).json({ error: err.message });
    }
}

module.exports = {
    getAll,
    update,
};