import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(tz)

export default class VirtualClock {
    static currTime;
    week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor() {
        VirtualClock.currTime = dayjs.utc(dayjs()).tz('Europe/Rome');
    }

    getTime(){
        return VirtualClock.currTime.toISOString();
    }

    getDay(){
        return this.week_days[VirtualClock.currTime.day()]
    }

    setTime(time){
        VirtualClock.currTime = time;
    }
}
