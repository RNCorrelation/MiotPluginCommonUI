/*
 * @Date: 2019-08-23 09:52:15
 * @LastEditors: Lavie
 * @LastEditTime: 2019-08-23 10:42:33
 */
import {
  LHMiServer
} from 'LHCommonFunction';

const expireTime = 8640000000;

export default class LHCurveCache {
  static requestCache = {
    htDayRequest: false,
    htWeekRequest: false,
    htMonthRequest: false,
    pressureDayRequest: false,
    pressureWeekRequest: false,
    pressureMonthRequest: false
  }

  /**
   * 保存曲线的缓存
   */
  static saveChartCache = (cacheKey, data) => {
    const cacheData = data ? JSON.stringify(data) : '';
    console.log('saveChartCache ' + cacheData);
    LHMiServer.SetHostStorage(cacheKey, cacheData, { expire: expireTime });
  }

  /**
   * 获取曲线的缓存
   */
  static getChartCache = (cacheKey, onSuccess, onFail) => {
    LHMiServer.GetHostStorage(cacheKey).then((res) => {
      const data = res ? JSON.parse(res) : [];
      console.log('getChartCache ' + data);
      if (typeof onSuccess === 'function') onSuccess(data);
    }).catch(() => {
      if (typeof onFail === 'function') onFail();
    });
  }
}