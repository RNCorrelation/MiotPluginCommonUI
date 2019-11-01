/*
 * @Date: 2019-08-23 09:24:57
 * @LastEditors: Lavie
 * @LastEditTime: 2019-10-22 11:27:42
 */
import React from 'react';
import { WebView } from 'react-native';
import {
  Device, Service
} from 'miot';
import {
  LHCommonLocalizableString,
  LHElectricityDataManager,
  LHPureRenderDecorator,
  LHUiUtils,
  LHDateUtils
} from 'LHCommonFunction';
import LHCurveCache from './LHCurveCache';

class LHCurve extends React.Component {
  static getDateConfig = (type) => {
    const dayItem = LHCommonLocalizableString.common_date_day + '_' + 0;

    const weektem = LHCommonLocalizableString.common_date_week + '_' + 1;

    const monyhItem = LHCommonLocalizableString.common_date_month + '_' + 2;
    let dateList = [dayItem, weektem, monyhItem];
    if (type === 'power') {
      dateList = [dayItem, weektem];
    } else if (type === 'electricity') {
      dateList = [dayItem, monyhItem];
    }
    return dateList.join(',');
  }

  static getPlugUnit = (type) => {
    const unitType = {
      electricity: LHCommonLocalizableString.comon_unit_kwh,
      power: LHCommonLocalizableString.comon_unit_w,
      ht: LHCommonLocalizableString.common_degree_centigrade
    };
    return unitType[type] || '';
  }

  static getChartType = (type) => {
    const allType = {
      electricity: 'bar',
      power: 'line',
      ht: 'line',
      pressure: 'line'
    };
    return allType[type] || 'line';
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  /**
 * 北京时间戳转当地时间戳
 * @param {*} beijingStamp
 */
  beijngStampToLocal = (beijingStamp) => {
    const timeStamp = Number(beijingStamp) > 10000000000 ? beijingStamp : beijingStamp * 1000;
    const targetTimezone = -8;
    const dif = new Date().getTimezoneOffset() / 60;
    const localTime = timeStamp + Math.abs(targetTimezone - dif) * 60 * 60 * 1000;
    return localTime;
  }

  tranlateStrToNum = (numStrValue, digits) => {
    if (numStrValue) {
      const newStrValue = JSON.parse(numStrValue);
      if (newStrValue.length) {
        const numStr = newStrValue[0];
        return Number(numStr);
      }
    }
    return Number(0).toFixed(digits);
  }

  tranlateResValue = (res, digits) => {
    if (!res.length) return [];
    const temp = [];
    const { type } = this.props;
    for (let i = 0; i < res.length; i += 1) {
      const resItem = res[i];
      const resItemValue = this.tranlateStrToNum(resItem.value, digits);
      let itemValue;
      if (type === 'electricity' || type === 'power') {
        let showValue = type === 'electricity' ? resItemValue / 1000.0 : resItemValue;
        showValue = showValue >= 1000 ? parseInt(showValue, 10) : showValue.toFixed(digits);
        itemValue = showValue;
        // console.log('LHCurve tranlateResValue itemValue', itemValue);
      } else {
        itemValue = (type === 'pressure') ? (resItemValue / 1000.0).toFixed(digits) : resItemValue.toFixed(digits);
      }
      temp.push({
        time: type === 'pressure' || type === 'power' ? this.beijngStampToLocal(resItem.time) / 1000 : this.beijngStampToLocal(resItem.time),
        value: itemValue
      });
    }
    return temp;
  }

  numFormat = (num) => {
    const res = num.toString().replace(/\d+/, (n) => { // 先提取整数部分
      return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
        return $1 + ',';
      });
    });
    return res;
  }

  fetchPowerDatas = (data, params) => {
    const cacheKey = Device.deviceID + '_power_' + params.data_type + '_data_' + Service.account.ID;
    LHElectricityDataManager.fetchPowerData(params).then((res) => {
      // console.log(JSON.stringify(this.tranlateResValue(res, 2)), 'params.data_type:' + data);
      const chartData = res ? this.tranlateResValue(res, 2) : [];
      this.postMessageToHtml(data, chartData);
      LHCurveCache.saveChartCache(cacheKey, chartData);
    }).catch(() => {
      this.failLoadCache(data, cacheKey);
    });
  }

  postMessageToHtml = (data, chartData) => {
    this.webview.postMessage(JSON.stringify({
      onSuccess: data.onSuccess,
      data: chartData
    }));
  }

  /**
   * @author: Lavie
   * @description: 拉取失败的时候去拉缓存
   * @param {type}
   * @return:
   */
  failLoadCache = (data, cacheKey) => {
    LHCurveCache.getChartCache(cacheKey, (res) => {
      this.postMessageToHtml(data, res || []);
    }, () => {
      this.webview.postMessage(JSON.stringify({
        onFailed: data.onFailed
      }));
    });
  }

  fetchBatteryDatas = (data, params) => {
    const cacheKey = Device.deviceID + '_battery_' + params.data_type + '_data_' + Service.account.ID;
    LHElectricityDataManager.fetchElectricityData(params)
      .then((res) => {
        // console.log(res, JSON.stringify(this.tranlateResValue(res, 1)));
        const chartData = res ? this.tranlateResValue(res, 1) : [];
        this.postMessageToHtml(data, chartData);
        LHCurveCache.saveChartCache(cacheKey, chartData);
      })
      .catch(() => {
        this.failLoadCache(data, cacheKey);
      });
  }

  fetchHtDatas = (data, params) => {
    const cacheKey = Device.deviceID + '_ht_' + params.data_type + '_data_' + Service.account.ID;
    LHElectricityDataManager.FetchHtData(params, params, [], [], (res) => {
      // console.log('fetchHtDatas', JSON.stringify(res || []));
      this.postMessageToHtml(data, res || []);
      LHCurveCache.saveChartCache(cacheKey, res || []);
    })
      .catch(() => {
        this.failLoadCache(data, cacheKey);
      });
  }

  fetchPressureDatas = (data, params) => {
    const cacheKey = Device.deviceID + '_pressure_' + params.data_type + '_data_' + Service.account.ID;
    LHElectricityDataManager.fetchPressureDatas(params, [], (res) => {
      // console.log('fetchPressureDatas',this.tranlateResValue(res, 0));
      const chartData = res ? this.tranlateResValue(res, 1) : [];
      this.postMessageToHtml(data, chartData);
      LHCurveCache.saveChartCache(cacheKey, chartData);
    })
      .catch(() => {
        this.failLoadCache(data, cacheKey);
      });
  }

  fetchChartData(data) {
    const { type } = this.props;
    const params = {
      start_date: LHDateUtils.DateFormat('yyyy/MM/dd', data.startTime),
      end_date: LHDateUtils.DateFormat('yyyy/MM/dd', Math.ceil(data.endTime / (24 * 60 * 60)) * 24 * 60 * 60),
      data_type: data.data_type
    };
    // console.log('LHCurve fetchPowerData', data, params);
    if (type === 'power') {
      this.fetchPowerDatas(data, params);
    } else if (type === 'electricity') {
      this.fetchBatteryDatas(data, params);
    } else {
      params.time_start = data.startTime;
      params.time_end = data.endTime;
      if (type === 'ht') {
        this.fetchHtDatas(data, params);
      } else if (type === 'pressure') {
        this.fetchPressureDatas(data, params);
      }
    }
  }

  webViewMessage(e) {
    // 数据请求
    // console.log(e.nativeEvent.data);
    this.fetchChartData(JSON.parse(e.nativeEvent.data));
  }

  render() {
    const { type, dateActive } = this.props;
    const dateConfig = LHCurve.getDateConfig(type);
    const unitConfig = LHCurve.getPlugUnit(type);
    // console.warn(LHCommonLocalizableString.getInterfaceLanguage());
    const language = LHCommonLocalizableString.getInterfaceLanguage();
    const chartType = LHCurve.getChartType(type);
    const injectedJavaScript = 'document.querySelector("html").setAttribute("curve-type", "' + chartType + '");'
      + 'document.querySelector("html").setAttribute("plug-unit", "' + unitConfig + '");'
      + 'document.querySelector("html").setAttribute("date-active", "' + (dateActive || 0) + '");'
      + 'document.querySelector("html").setAttribute("date-config", "' + dateConfig + '");'
      + 'document.querySelector("html").setAttribute("html-font-size", "' + LHUiUtils.GetPx(50) + '");'
      + 'document.querySelector("html").setAttribute("curve-name", "' + type + '");'
      + 'document.querySelector("html").setAttribute("curr-language", "' + language + '");'
      + 'document.querySelector("html").setAttribute("no-data-text", "' + LHCommonLocalizableString.common_log_no_data + '");'
      + 'document.querySelector("html").setAttribute("loading-text", "' + LHCommonLocalizableString.common_log_loading + '");'
      + 'document.querySelector("html").setAttribute("loading-failed", "' + LHCommonLocalizableString.common_tips_loading_failed_retry + '");'
      + 'document.querySelector("html").classList.add("' + type + '");'
      + 'document.documentElement.style.fontSize= "' + LHUiUtils.GetPx(50) + 'px";';
    return (
      <WebView
        ref={(webview) => {
          this.webview = webview;
        }}
        onMessage={(e) => {
          this.webViewMessage(e);
        }}
        javaScriptEnabled
        bounces={false}
        scrollEnabled={false}
        source={require('./index.html')}
        style={{
          flex: 1
        }}
        injectedJavaScript={injectedJavaScript}
      />
    );
  }
}

export default LHPureRenderDecorator(LHCurve);
