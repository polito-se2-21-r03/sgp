const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');

dayjs.extend(utc)
dayjs.extend(tz)
dayjs.tz.setDefault('Europe/Rome');

module.exports = class VirtualClock {
    static currTime;
    week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor() {
        VirtualClock.currTime = dayjs();
    }

    getTime(){
        return VirtualClock.currTime.toISOString();
    }

    getDay(){
        return this.week_days[VirtualClock.currTime.day()]
    }

    setTime(time){
        VirtualClock.currTime = dayjs(time);
        return VirtualClock.currTime;
    }
}
