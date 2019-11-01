/**
* @module LHCommonUI/LHStandardLogUI
* @description 日志UI组件
* @property {Object} [style] SectionList样式
* @property {number} [styleType=0] 日志样式类型：0.普通日志 1.卡片式日志
* @property {string} [emptyText=暂无日志] 空日志文案
* @property {string} [emptyText=暂无日志] 空日志文案
* @property {Object} [emptyStyle] 空日志页面样式
* @property {string} [loadingText=加载中] 加载更多的文案 全部数据已加载完成
* @property {string} [allDataHasLoadedText=全部数据已加载完成] 全部日志已经加载完文案的文案，数据多于一页才会显示
* @property {string} [titleNumberOfLines=2] 日志标题显示的行数
* @property {number} [page] 当前页数
* @property {number} [pageSize] 每页的数据长度
* @property {number} [boolean] 是否在加载中
* @property {number} [pageOver] 全部数据已经加载完毕
* @property {number} [firstIn] 是否首次进入页面，用于控制加载中的显示
* @property {Object[]} logListData 日志数据列表
* @property {Object} extraParam 请求参数，只需key和type
* @property {Function} [onEndReached] 滚动到底部回调
* @property {Function} [hasRefreshControl=true] 是否启用下拉刷新
* @property {Function} [onRefresh] 下拉刷新回调
* @property {Function} [showsScrollIndicator=false] 是否显示滚动条
* @property {Function} dataMap 文案转换方法，返回对象，context为对应文案，logType 控制日志前面圆圈的颜色，可选值['event', 'error', 'alert']
* @example
*
* import { LHStandardLogUI } from "LHCommonUI";
*
* <LHStandardLogUI
*   logListData={logListData}
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
  StyleSheet,
  SectionList,
  Text,
  View,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import {
  LHUiUtils,
  LHDateUtils,
  LHCommonLocalizableString,
  LHPureRenderDecorator,
  LHDeviceUtils
} from 'LHCommonFunction';
import { LHStandardEmpty, LHSeparator } from 'LHCommonUI';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  sectionListStyle: {
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  },
  gap: {
    height: LHUiUtils.GetPx(8),
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  },
  borderTop: {
    height: LHUiUtils.GetPx(32),
    paddingLeft: LHUiUtils.GetPx(24),
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  listTitle: {
    flex: 1,
    color: LHUiUtils.MiJiaListHeaderColor,
    fontSize: LHUiUtils.GetPx(11),
    fontFamily: LHUiUtils.DefaultFontFamily,
    marginTop: LHUiUtils.GetPx(9),
    marginBottom: LHUiUtils.GetPx(8.5)
  },
  row: {
    flexDirection: 'row'
  },
  itemWrap: {
    paddingLeft: LHUiUtils.GetPx(24.5),
    paddingRight: LHUiUtils.GetPx(24),
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  time: {
    width: LHUiUtils.GetPx(23 + 34),
    fontSize: LHUiUtils.GetPx(14),
    lineHeight: LHUiUtils.GetPx(20),
    color: LHUiUtils.MiJiaTitleColor,
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  lineWrap: {
    alignItems: 'center'
  },
  contextValue: {
    paddingVertical: LHUiUtils.GetPx(15),
    flex: 1
  },
  context: {
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(20),
    marginLeft: LHUiUtils.GetPx(20),
    color: LHUiUtils.MiJiaTitleColor,
    fontFamily: LHUiUtils.DefaultFontFamily,
    letterSpacing: 0
  },
  subContext: {
    marginTop: 1,
    marginLeft: LHUiUtils.GetPx(20),
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    color: LHUiUtils.MiJiaSubTitleColor,
    fontFamily: LHUiUtils.DefaultFontFamily,
    letterSpacing: 0
  },
  circle: {
    width: LHUiUtils.GetPx(5),
    height: LHUiUtils.GetPx(5),
    borderRadius: LHUiUtils.GetPx(2.5),
    backgroundColor: '#d8d8d8'
  },
  line: {
    width: LHUiUtils.MiJiaBorderWidth,
    height: LHUiUtils.GetPx(21),
    backgroundColor: '#e5e5e5'
  },
  lineBottom: {
    flex: 1,
    width: LHUiUtils.MiJiaBorderWidth,
    backgroundColor: '#e5e5e5'
  },
  lastItem: {
    paddingBottom: LHUiUtils.GetPx(14)
  },
  noMoreWrap: {
    backgroundColor: LHUiUtils.MiJiaBackgroundGray,
    paddingTop: LHUiUtils.GetPx(16),
    paddingBottom: LHUiUtils.GetPx(16) + LHDeviceUtils.AppHomeIndicatorHeight / 2,
    alignItems: 'center'
  },
  noMoreText: {
    color: LHUiUtils.MiJiaSubTitleColor,
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    letterSpacing: 0,
    textAlign: 'center',
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  loadingcontainer: {
    backgroundColor: LHUiUtils.MiJiaBackgroundGray,
    paddingTop: LHUiUtils.GetPx(16),
    paddingBottom: LHUiUtils.GetPx(16) + LHDeviceUtils.AppHomeIndicatorHeight / 2,
    alignItems: 'center'
  },
  loadingWrap: {
    flexDirection: 'row'
  },
  loadingText: {
    color: LHUiUtils.MiJiaSubTitleColor,
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    letterSpacing: -0.11,
    marginLeft: LHUiUtils.GetPx(10),
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  footer: { // D
    height: LHUiUtils.GetPx(40),
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  }
});
class LHStandardLogUI extends React.Component {
  static getDataIndex = (dataList, data) => {
    for (let i = 0, len = dataList.length; i < len; i += 1) {
      if (LHDateUtils.DateFormat('yyyy-MM-dd', data.time) === LHDateUtils.DateFormat('yyyy-MM-dd', dataList[i].title)) return i;
    }
    return -1;
  }

  static defaultProps = {
    styleType: 0, // 0.普通日志 1.卡片式日志
    titleNumberOfLines: 2,
    hasRefreshControl: true,
    showsScrollIndicator: false // UI确认默认不要滚动条
  }

  static propTypes = {
    styleType: PropTypes.number,
    titleNumberOfLines: PropTypes.number,
    hasRefreshControl: PropTypes.bool,
    showsScrollIndicator: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getPageData() {
    const { logListData } = this.props;
    const result = this.dealData(logListData);
    return result;
  }

  dealData(data) {
    const { dataMap } = this.props;
    const result = [];
    for (let i = 0, len = data.length; i < len; i += 1) {
      // eslint-disable-next-line
      if (!dataMap(data[i])) continue;
      const dataItem = Object.assign({}, data[i], dataMap(data[i]), { time: data[i].time });
      const index = LHStandardLogUI.getDataIndex(result, dataItem);
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

  render() {
    const {
      style,
      styleType,
      emptyText,
      emptyIcon,
      emptyStyle,
      loadingText,
      allDataHasLoadedText,
      titleNumberOfLines,
      page,
      pageSize,
      isLoading,
      pageOver,
      firstIn,
      logListData,
      onEndReached,
      onRefresh,
      hasRefreshControl,
      showsScrollIndicator
    } = this.props;
    const pageData = this.getPageData();
    return (
      <SectionList
        resizeMode="stretch"
        initialNumToRender={20}
        showsVerticalScrollIndicator={showsScrollIndicator}
        style={[
          styles.sectionListStyle,
          style
        ]}
        sections={pageData}
        refreshControl={
          hasRefreshControl ? (
            <RefreshControl
              refreshing={page === 1 && isLoading}
              onRefresh={() => {
                if (typeof onRefresh === 'function') onRefresh();
              }}
            />
          ) : null
        }
        onEndReached={() => {
          if (typeof onEndReached === 'function') onEndReached();
        }}
        onEndReachedThreshold={0.2}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={() => {
          return (
            <LHStandardEmpty
              emptyPageStyle={emptyStyle}
              text={emptyText || LHCommonLocalizableString.common_log_no_logs}
              emptyIcon={emptyIcon}
            />
          );
        }}
        renderItem={({ item, index, section }) => {
          const circleColor = item.logType === 'alert' ? LHUiUtils.MiJiaOrangeColor : item.logType === 'error' ? '#F46666' : '#d8d8d8';
          const textColor = item.logType === 'alert' ? LHUiUtils.MiJiaOrangeColor : item.logType === 'error' ? '#F46666' : LHUiUtils.MiJiaTitleColor;
          let subContext = null;
          if (item.subContext) {
            subContext = (
              <Text
                style={[
                  styles.subContext,
                  item.subContextStyle,
                  { lineHeight: styleType === 0 ? LHUiUtils.GetPx(16) : LHUiUtils.GetPx(12) }]}
                numberOfLines={1}
              >
                {item.subContext}
              </Text>
            );
          }
          return (
            <View>
              <View style={[
                styles.row,
                styles.itemWrap,
                index === section.data.length - 1 && styleType === 0 ? styles.lastItem : null
              ]}
              >
                <Text style={[styles.time, {
                  marginTop: subContext ? LHUiUtils.GetPx(11) : LHUiUtils.GetPx(15),
                  color: styleType === 0 ? LHUiUtils.MiJiaTitleColor : LHUiUtils.MiJiaListHeaderColor
                }]}
                >
                  {LHDateUtils.DateFormat('hh:mm', item.time)}

                </Text>
                <View style={styles.lineWrap}>
                  <View style={[
                    styles.line,
                    { backgroundColor: index === 0 ? 'transparent' : '#E5E5E5', height: subContext ? LHUiUtils.GetPx(19) : LHUiUtils.GetPx(23) }
                  ]}
                  />
                  <View style={[styles.circle, { backgroundColor: circleColor }]} />
                  <View style={[
                    styles.lineBottom,
                    { backgroundColor: index === section.data.length - 1 ? 'transparent' : '#E5E5E5' }
                  ]}
                  />
                </View>
                <View style={[styles.contextValue, { paddingVertical: subContext ? LHUiUtils.GetPx(11) : LHUiUtils.GetPx(15) }]}>
                  <Text style={[styles.context, { color: textColor }]} numberOfLines={titleNumberOfLines}>{item.context}</Text>
                  {subContext}
                </View>
              </View>
              {
                index === section.data.length - 1 && styleType === 0 ? (
                  <LHSeparator
                    style={[
                      { marginBottom: LHUiUtils.GetPx(0.5) }
                    ]}
                  />
                ) : null
              }
            </View>
          );
        }}
        renderSectionHeader={({ section }) => {
          let gapElement = null;
          if (pageData[0].title !== section.title && styleType === 0) {
            gapElement = (
              <View>
                <View style={styles.gap} />
                <LHSeparator
                  style={[
                    { alignSelf: 'flex-start' }
                  ]}
                />
              </View>
            );
          }
          return (
            <View style={{ paddingBottom: LHUiUtils.GetPx(14), backgroundColor: LHUiUtils.MiJiaWhite }}>
              {gapElement}
              <View style={[styles.borderTop]}>
                <Text style={styles.listTitle}>
                  {LHDateUtils.GetStandardTimeText(section.title)}
                </Text>
                <LHSeparator />
              </View>
            </View>
          );
        }}
        ListFooterComponent={() => {
          if (!isLoading && pageOver && logListData.length > pageSize && !firstIn) {
            return (
              <View style={[styles.noMoreWrap, { backgroundColor: styleType === 0 ? LHUiUtils.MiJiaBackgroundGray : LHUiUtils.MiJiaWhite }]}>
                <Text style={styles.noMoreText}>{allDataHasLoadedText || LHCommonLocalizableString.common_log_all_data_has_been_loaded}</Text>
              </View>
            );
          } else if (page !== 1 && isLoading) {
            return (
              <View style={[styles.loadingcontainer, { backgroundColor: styleType === 0 ? LHUiUtils.MiJiaBackgroundGray : LHUiUtils.MiJiaWhite }]}>
                <View style={styles.loadingWrap}>
                  <ActivityIndicator color={LHUiUtils.MiJiaSubTitleColor} />
                  <Text style={styles.loadingText}>{loadingText || LHCommonLocalizableString.common_log_loading}</Text>
                </View>
              </View>
            );
          } else if (!isLoading && pageData.length === 0) {
            return null;
          } else {
            return <View style={[styles.footer, { backgroundColor: styleType === 1 && !isLoading ? LHUiUtils.MiJiaWhite : LHUiUtils.MiJiaBackgroundGray }]} />;
          }
        }}
        keyExtractor={(item, index) => { return index; }}
      />
    );
  }
}
export default LHPureRenderDecorator(LHStandardLogUI);