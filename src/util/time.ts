import moment from 'moment';

export class TimeUtil {
  getUnixTimeForAFutureDay(days: number): number {
    return moment().add(days, 'days').unix();
  }
}
