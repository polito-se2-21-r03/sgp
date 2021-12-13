const VirtualClock = require("../utils/virtual-clock");
const Routine = require("../utils/routine");
const { validationResult } = require('express-validator');

const virtualClock = new VirtualClock();
const routine = new Routine();

async function getAll(req, res) {
    return res.status(200).json({
        time: virtualClock.getTime(),
        day: virtualClock.getDay()
    })
}

async function updateTime(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const time = req.params.time;
    try {
        const virtualTime = virtualClock.setTime(time);
        await routine.routine(virtualTime)
            .then(() => res.status(200).json({
                time: virtualClock.getTime(),
                day: virtualClock.getDay()
            }))
            .catch(err => res.status(503).json({ error: err.message }))
    } catch (error) {
        res.status(500).json({error});
    }
}

module.exports = {
    getAll,
    updateTime,
};
