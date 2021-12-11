const { models } = require('../../sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Validator } = require("jsonschema");
const OrderRequestSchema = require("../schemas/order-request");
const { DataTypes, Error} = require("sequelize");

async function getAll(req, res) {
    return res.status(200).json({currentTime: vtc.time(), day: vtc.day()})
}

async function update(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const time = req.body.time;

    try {
        let newTime = vtc.set(time);
        sys.checkTimedEvents(newTime);
        res.status(200).json({currentTime: vtc.time(), day: vtc.day()});
    } catch (error) {
        res.status(500).json({error});
    }
}

module.exports = {
    getAll,
    update,
};
