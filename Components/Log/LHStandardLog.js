/**
* @module LHCommonUI/LHStandardLog
* @description 日志组件
* @property {Object} [style] SectionList样式
* @property {number} [styleType=0] 日志样式类型：0.普通日志 1.卡片式日志
* @property {string} [emptyText=暂无日志] 空日志文案
* @property {string} [emptyText=暂无日志] 空日志文案
* @property {Object} [emptyStyle] 空日志页面样式
* @property {string} [loadingText=加载中] 加载更多的文案 全部数据已加载完成
* @property {string} [allDataHasLoadedText=全部数据已加载完成] 全部日志已经加载完文案的文案，数据多于一页才会显示
* @property {string} [titleNumberOfLines=2] 日志标题显示的行数
* @property {Function} [showsScrollIndicator=false] 是否显示滚动条
* @property {Object} extraParam 请求参数，只需key和type
* @property {Function} dataMap 文案转换方法，返回对象，context为对应文案，logType 控制日志前面圆圈的颜色，可选值['event', 'error', 'alert']
* @example
* import { LHStandardLog } from "LHCommonUI";
*
* <LHStandardLog
*   extraParam={{
*     type: 'event',
*     key: '5.1'
*   }}
*   dataMap={(data) => {
*     return {
*        context: 'test',
*        subContext: 'test',
*        logType: 'event'
*     };
*   }}
* />
*/
import React from 'react';
import {
  Device
} from 'miot';
import {
  LHDateUtils,
  LHPureRenderDecorator,
  LHMiServer,
  CommonMethod
} from 'LHCommonFunction';
import { LHStandardLogUI } from 'LHCommonUI';
import PropTypes from 'prop-types';

class LHStandardLog extends React.Component {
  static getDataIndex = (dataList, data) => {
    for (let i = 0, len = dataList.length; i < len; i += 1) {
      if (LHDateUtils.DateFormat('yyyy-MM-dd', data.time) === LHDateUtils.DateFormat('yyyy-MM-dd', dataList[i].title)) return i;
    }
    return -1;
  }

  static defaultProps = {
    loadCache: false,
    styleType: 0, // 0.普通日志 1.卡片式日志
    titleNumberOfLines: 2,
    showsScrollIndicator: false // UI确认默认不要滚动条
  }

  static propTypes = {
    loadCache: PropTypes.bool,
    styleType: PropTypes.number,
    titleNumberOfLines: PropTypes.number,
    showsScrollIndicator: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.timestamp = Math.floor(+new Date() / 1000);
    const { serverType, extraParam } = this.props;
    if (serverType === 'ScenesHistory') {
      this.cacheKey = CommonMethod.CreatCacheKey('Log_IFTTT');
    } else {
      // 存在同一个插件请求不同key值的日志页面，缓存加上key
      this.cacheKey = CommonMethod.CreatCacheKey('Log_Normal_' + ((extraParam && extraParam.key) || ''));
    }
    this.pageSize = 20;
    this.state = {
      logListData: [],
      isLoading: true,
      page: 1,
      pageOver: false,
      firstIn: true
    };
  }

  async componentDidMount() {
    const { loadCache } = this.props;
    if (loadCache) await this.getLocalData();
    this.getServerData(1);
  }

  componentWillUnmount() {
    this.clearTimeoutId();
  }

  onRefresh() {
    this.timestamp = Math.floor(+new Date() / 1000);
    this.setState({ page: 1 });
    this.getServerData(1);
  }

  onEndReached() {
    const { page, firstIn } = this.state;
    if (firstIn) return;
    const { isLoading, pageOver } = this.state;
    if (isLoading || pageOver) return;
    this.getServerData(page);
  }

  /**
   * @description 获取缓存的日志
   */
  async getLocalData() {
    const { extraParam, serverType } = this.props;
    if (extraParam && extraParam.limit) this.pageSize = extraParam.limit;
    let res;
    if (serverType === 'ScenesHistory') {
      res = await LHMiServer.GetHostStorage(this.cacheKey);
    } else {
      res = await LHMiServer.GetHostStorage(this.cacheKey);
    }
    if (res) {
      await this.setState({ logListData: res });
    }
  }

  setLocalData(page, dataSource) {
    const { loadCache } = this.props;
    if (loadCache && page === 1) {
      LHMiServer.SetHostStorage(this.cacheKey, dataSource);
    }
  }

  getServerData(page) {
    this.setState({ isLoading: true });
    const {
      extraParam,
      serverType
    } = this.props;
    if (extraParam && extraParam.limit) this.pageSize = extraParam.limit;
    // serverType 为ScenesHistory时获取的是指定设备的智能日志信息
    if (serverType === 'ScenesHistory') {
      LHMiServer.LoadScenesHistoryForDevice(Device.deviceID, this.timestamp, this.pageSize, (res) => {
        const dataSource = (res && res.history) || [];
        this.setLocalData(page, dataSource);
        this.dealSucc(page, dataSource);
      }, () => {
        this.setState({ isLoading: false });
      });
    } else {
      LHMiServer.GetUserDeviceDataTab(Object.assign({}, {
        did: Device.deviceID,
        timestamp: this.timestamp,
        limit: this.pageSize
      }, extraParam), (res) => {
        const dataSource = (res && res.data) || [];
        this.setLocalData(page, dataSource);
        this.dealSucc(page, dataSource);
      }, () => {
        this.setState({ isLoading: false });
      });
    }
  }

  getPageData() {
    const { logListData } = this.state;
    const result = this.dealData(logListData);
    return result;
  }

  dealSucc(page, dataSource) {
    console.log(dataSource);
    let pageOverFlag = true;
    if (dataSource.length === this.pageSize) {
      pageOverFlag = false;
      this.timestamp = dataSource[this.pageSize - 1].time;
    }
    let data = [];
    if (page === 1) {
      data = dataSource;
    } else {
      const { logListData } = this.state;
      data = logListData.concat(dataSource);
    }
    this.setState({
      logListData: data,
      pageOver: pageOverFlag
    });
    this.clearTimeoutId();
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      this.setState({
        firstIn: false,
        isLoading: false,
        page: page + 1
      });
    }, 200);
  }

  dealData(data) {
    const { dataMap } = this.props;
    const result = [];
    for (let i = 0, len = data.length; i < len; i += 1) {
      // eslint-disable-next-line
      if (!dataMap(data[i])) continue;
      const dataItem = Object.assign({}, data[i], dataMap(data[i]), { time: data[i].time });
      const index = LHStandardLog.getDataIndex(result, dataItem);
      if (index > -1) {
        result[index].data.push(dataItem);
      } else {
        result.push({
          title: dataItem.time,
          data: [dataItem]
        });
      }
    }
    return result;
  }

  clearTimeoutId() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  render() {
    const {
      page,
      isLoading,
      pageOver,
      firstIn,
      logListData
    } = this.state;
    const {
      style,
      styleType,
      emptyText,
      emptyIcon,
      emptyStyle,
      loadingText,
      allDataHasLoadedText,
      titleNumberOfLines,
      showsScrollIndicator,
      dataMap
    } = this.props;
    return (
      <LHStandardLogUI
        page={page}
        pageSize={this.pageSize}
        isLoading={isLoading}
        pageOver={pageOver}
        firstIn={firstIn}
        logListData={logListData}
        style={style}
        styleType={styleType}
        emptyText={emptyText}
        emptyIcon={emptyIcon}
        emptyStyle={emptyStyle}
        loadingText={loadingText}
        allDataHasLoadedText={allDataHasLoadedText}
        titleNumberOfLines={titleNumberOfLines}
        showsScrollIndicator={showsScrollIndicator}
        dataMap={dataMap}
        onEndReached={() => {
          this.onEndReached();
        }}
        onRefresh={() => {
          this.onRefresh();
        }}
      />
    );
  }
}
export default LHPureRenderDecorator(LHStandardLog);
